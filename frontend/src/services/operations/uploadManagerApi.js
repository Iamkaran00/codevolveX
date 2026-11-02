import axios from 'axios' ; 
import { apiConnector } from '../apiconnector';
import store from '../../utils/store' ; 
import { setUpload } from '../../slices/upload.slice';
import { replaceSection } from '../../slices/course.slice';
import { course_endpoints } from '../apis';
const {INIT_UPLOAD_API , COMPLETE_UPLOAD_API , REFRESH_URLS_API , ABORT_UPLOAD_API}  = course_endpoints ; 
const E = {
    INIT : INIT_UPLOAD_API , 
    COMPLETE : COMPLETE_UPLOAD_API ,
    REFRESH : REFRESH_URLS_API , 
    ABORT : ABORT_UPLOAD_API
}  ; 
const getAuth = () => ({Authorization : `Bearer ${store.getState().auth.token}`}) ; 

const live = new Map();                       // id → AbortController, uploads running in this tab
export const isLive = (id) => live.has(id);

const CONCURRENCY = 4;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function beginUpload({ file, meta, dispatch }) {
  // STAGE 1: small JSON call; the server authorizes and returns one signed URL per part
  const init = await apiConnector(
    "POST",
    E.INIT,
    { ...meta, fileName: file.name, size: file.size, contentType: file.type },
    null,
    getAuth(),
  );
  const { subSectionId: id, partSize, urls, updatedSection } = init.data;

  dispatch(replaceSection(updatedSection));   // lecture row appears now, with status "uploading"

  const ctrl = new AbortController();
  live.set(id, ctrl);
  dispatch(
    setUpload({
      id,
      name: file.name,
      title: meta.title,
      size: file.size,
      sectionId: meta.sectionId,
      pct: 0,
      status: "uploading",
    }),
  );

  run({ id, file, partSize, urls, ctrl, sectionId: meta.sectionId, dispatch }).finally(() =>
    live.delete(id),
  );

  return { id };                              // the caller can close the modal right away
}

async function run({ id, file, partSize, urls, ctrl, sectionId, dispatch }) {
  const parts = new Array(urls.length);
  const loaded = new Array(urls.length).fill(0);
  let next = 0;
  let last = 0;

  const report = (force) => {
    const now = Date.now();
    if (!force && now - last < 250) return;   // throttle Redux updates
    last = now;
    const sum = loaded.reduce((a, b) => a + b, 0);
    dispatch(setUpload({ id, pct: Math.min(99, Math.round((sum / file.size) * 100)) }));
  };

  async function worker() {
    while (next < urls.length && !ctrl.signal.aborted) {
      const i = next++;
      const blob = file.slice(i * partSize, (i + 1) * partSize);
      let attempt = 0;
      let refreshes = 0;
      for (;;) {
        try {
          // STAGE 2: plain axios (NOT axiosInstance): no baseURL, no headers, no interceptor
          const r = await axios.put(urls[i], blob, {
            signal: ctrl.signal,
            onUploadProgress: (e) => {
              loaded[i] = e.loaded;
              report(false);
            },
          });
          loaded[i] = blob.size;
          parts[i] = { PartNumber: i + 1, ETag: r.headers.etag };   // B2's receipt for this part
          break;
        } catch (err) {
          if (axios.isCancel(err)) throw err;
          loaded[i] = 0;
          if (err.response?.status === 403 && refreshes++ < 2) {    // signed URL expired: get a fresh one
            const r = await apiConnector(
              "POST",
              E.REFRESH,
              { subSectionId: id, partNumbers: [i + 1] },
              null,
              getAuth(),
            );
            urls[i] = r.data.urls[0];
            continue;
          }
          if (attempt++ >= 3) throw err;
          await sleep(1000 * 2 ** attempt);                          // backoff: 2s, 4s, 8s
        }
      }
    }
  }

  try {
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));
    if (ctrl.signal.aborted) return;
    if (parts.some((p) => !p?.ETag))
      throw new Error("Missing ETag: check the bucket CORS exposeHeaders");

    // STAGES 3-4: the server joins the parts, verifies the size, records "uploaded"
    dispatch(setUpload({ id, pct: 100, status: "verifying" }));
    const done = await apiConnector(
      "POST",
      E.COMPLETE,
      { subSectionId: id, sectionId, parts },
      null,
      getAuth(),
    );
    dispatch(replaceSection(done.data.updatedSection));
    dispatch(setUpload({ id, status: "uploaded" }));
  } catch (err) {
    if (axios.isCancel(err) || ctrl.signal.aborted) return;
    dispatch(setUpload({ id, status: "failed", error: err.response?.data?.message || err.message }));
  }
}

export async function cancelUpload({ id, sectionId, dispatch }) {
  live.get(id)?.abort();
  live.delete(id);
  try {
    const r = await apiConnector("POST", E.ABORT, { subSectionId: id, sectionId }, null, getAuth());
    dispatch(replaceSection(r.data.updatedSection));
  } catch {
    /* leftover record; the Phase 2 cleanup job will handle it */
  }
  dispatch(setUpload({ id, status: "cancelled" }));
}
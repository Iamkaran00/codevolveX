import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { VscChevronLeft } from "react-icons/vsc";
import { HiOutlineCamera, HiOutlineArrowUpTray } from "react-icons/hi2";
import {
  updateDisplayPicture,
  updateProfile,
  deleteProfile,
} from "../services/operations/profileApi";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-zinc-100 outline-none transition-all duration-500 placeholder:text-zinc-600 focus:border-[#ffb454]/60 focus:bg-white/[0.05] [color-scheme:dark]";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#ffb454] px-6 py-2.5 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-500";

const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:bg-[#ffb454]/10 hover:text-[#ffb454]";

const Section = ({ title, hint, children }) => (
  <motion.section
    variants={fadeUp}
    className="grid gap-6 border-t border-white/[0.07] py-10 md:grid-cols-[200px_1fr] md:gap-14"
  >
    <div>
      <h2 className={`text-xl font-semibold tracking-tight text-[#f3ece0] ${display}`}>
        {title}
      </h2>
      {hint && <p className="mt-2 text-sm leading-relaxed text-zinc-500">{hint}</p>}
    </div>
    <div className="min-w-0">{children}</div>
  </motion.section>
);

const Field = ({ label, htmlFor, children }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={htmlFor} className="text-sm text-zinc-500">
      {label}
    </label>
    {children}
  </div>
);

const Settings = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const reduce = useReducedMotion();

  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [formData, setFormData] = useState({
    dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
    gender: user?.additionalDetails?.gender || "Male",
    contactNumber: user?.additionalDetails?.contactNumber || "",
    about: user?.additionalDetails?.about || "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setPreviewSource(reader.result);
    }
  };

  const handleUploadPicture = () => {
    if (!imageFile) return;
    const fData = new FormData();
    fData.append("image", imageFile);
    dispatch(updateDisplayPicture(token, fData));
  };

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(token, formData));
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#100f0d] px-5 pb-28 pt-20 text-zinc-200">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <motion.div
        variants={stagger}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="relative mx-auto w-full max-w-4xl"
      >
        {/* header */}
        <motion.header variants={fadeUp} className="mb-12">
          <button
            type="button"
            onClick={() => navigate("/my-profile")}
            className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors duration-500 hover:text-[#ffb454]"
          >
            <VscChevronLeft size={16} /> Back to profile
          </button>
          <h1
            className={`text-5xl font-semibold leading-[1.04] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
          >
            Settings<span className="text-[#ffb454]">.</span>
          </h1>
          <p className="mt-4 text-[15px] text-zinc-500">
            Update your photo and personal details.
          </p>
        </motion.header>

        {/* photo */}
        <Section title="Profile photo" hint="PNG, JPG, GIF or WEBP. Max 5MB.">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <img
                src={previewSource || user?.image}
                alt="avatar"
                className="h-24 w-24 rounded-2xl bg-white/5 object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                aria-label="Choose a new photo"
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#100f0d] bg-[#ffb454] text-[#1d1a16] transition-transform duration-500 hover:scale-110"
              >
                <HiOutlineCamera size={15} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <p className="truncate text-[15px] text-zinc-300">
                {imageFile ? imageFile.name : "No file selected"}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/gif, image/jpeg, image/webp"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className={btnGhost}
                >
                  Browse
                </button>
                <button
                  type="button"
                  onClick={handleUploadPicture}
                  disabled={!imageFile}
                  className={btnPrimary}
                >
                  <HiOutlineArrowUpTray size={15} />
                  Upload
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* personal details */}
        <Section
          title="Personal details"
          hint="Shown on your profile badge. You can change these any time."
        >
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="Date of birth" htmlFor="dateOfBirth">
                <input
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={inputCls}
                />
              </Field>

              <Field label="Gender" htmlFor="gender">
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={inputCls}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </Field>

              <Field label="Phone number" htmlFor="contactNumber">
                <input
                  type="tel"
                  name="contactNumber"
                  id="contactNumber"
                  placeholder="+91 00000 00000"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="About" htmlFor="about">
              <textarea
                name="about"
                id="about"
                rows="4"
                placeholder="Tell the community about yourself..."
                value={formData.about}
                onChange={handleInputChange}
                className={`${inputCls} resize-none leading-relaxed`}
              />
            </Field>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/my-profile")}
                className={btnGhost}
              >
                Cancel
              </button>
              <button type="submit" className={btnPrimary}>
                Save changes
              </button>
            </div>
          </form>
        </Section>

        {/* danger zone */}
        <Section
          title="Delete account"
          hint="Permanently removes your account and all associated data."
        >
          <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.04] p-6">
            <p className="max-w-md text-[15px] leading-relaxed text-zinc-400">
              This cannot be undone. Your courses, progress and profile will be
              deleted for good.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center justify-center rounded-full border border-red-400/40 px-5 py-2.5 text-sm text-red-300 transition-all duration-500 hover:border-red-400/70 hover:bg-red-400/10"
                >
                  Delete account
                </button>
              ) : (
                <>
                  <span className="text-sm text-zinc-400">Are you sure?</span>
                  <button
                    type="button"
                    onClick={() => dispatch(deleteProfile(token, navigate))}
                    className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-500 hover:bg-red-400 active:scale-[0.98]"
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className={btnGhost}
                  >
                    Keep my account
                  </button>
                </>
              )}
            </div>
          </div>
        </Section>
      </motion.div>
    </div>
  );
};

export default Settings;
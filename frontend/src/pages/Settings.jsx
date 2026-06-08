import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { VscChevronLeft } from "react-icons/vsc";
import { HiOutlineCamera, HiOutlineArrowUpTray } from "react-icons/hi2";
import { updateDisplayPicture, updateProfile } from "../services/operations/profileApi";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const btnGhost = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "0.5rem",
  padding: "0.5rem 1.25rem",
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
  cursor: "pointer",
  transition: "border-color 0.15s, color 0.15s",
};

const btnPrimary = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  backgroundColor: "#4f46e5",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.5rem 1.25rem",
  fontSize: "13px",
  fontWeight: 600,
  color: "#ffffff",
  cursor: "pointer",
  transition: "opacity 0.15s",
};

const btnPrimaryDisabled = {
  ...btnPrimary,
  backgroundColor: "#a5b4fc",
  cursor: "not-allowed",
};

const Settings = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

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
    <div
      className="min-h-screen w-full bg-white pt-24 pb-20"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-3xl px-5 sm:px-8"
      >
        <motion.button
          variants={fadeUp}
          onClick={() => navigate("/my-profile")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          className="mb-8 flex items-center gap-1.5 text-[13px] font-semibold text-gray-400 transition-colors hover:text-indigo-600"
        >
          <VscChevronLeft className="text-base" />
          Back to Profile
        </motion.button>

        <motion.div variants={fadeUp} className="mb-10 border-b border-gray-100 pb-8">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-500">
            CodevolveX
          </p>
          <h1 className="text-[32px] font-extrabold tracking-tight text-gray-900">
            Account Settings
          </h1>
          <p className="mt-1.5 text-sm text-gray-400">
            Update your photo and personal details.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">

          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.04)]"
          >
            <div className="border-b border-gray-100 px-7 py-4">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-900">
                Profile Photo
              </h3>
            </div>

            <div className="flex items-center gap-6 px-7 py-6">
              <div className="relative shrink-0">
                <img
                  src={previewSource || user?.image}
                  alt="avatar"
                  className="h-20 w-20 rounded-full border-2 border-white object-cover shadow-md"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    position: "absolute",
                    bottom: "-4px",
                    right: "-4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "#4f46e5",
                    border: "2px solid #ffffff",
                    color: "#ffffff",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                >
                  <HiOutlineCamera style={{ fontSize: "13px" }} />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[14px] font-semibold text-gray-900">
                  {imageFile ? imageFile.name : "No file selected"}
                </p>
                <p className="text-[12px] text-gray-400">
                  PNG, JPG, GIF or WEBP · Max 5MB
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/gif, image/jpeg, image/webp"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    style={btnGhost}
                  >
                    Browse
                  </button>
                  <button
                    onClick={handleUploadPicture}
                    disabled={!imageFile}
                    style={imageFile ? btnPrimary : btnPrimaryDisabled}
                  >
                    <HiOutlineArrowUpTray style={{ fontSize: "14px" }} />
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            variants={fadeUp}
            onSubmit={handleFormSubmit}
            className="rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.04)] overflow-hidden"
          >
            <div className="border-b border-gray-100 px-7 py-4">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-900">
                Personal Details
              </h3>
            </div>

            <div className="flex flex-col gap-6 px-7 py-7">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Date of Birth">
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={inputCls}
                  />
                </Field>

                <Field label="Gender">
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
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Phone Number">
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

              <Field label="About / Bio">
                <textarea
                  name="about"
                  id="about"
                  rows="4"
                  placeholder="Tell the community about yourself..."
                  value={formData.about}
                  onChange={handleInputChange}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/60 px-7 py-4">
              <button
                type="button"
                onClick={() => navigate("/my-profile")}
                style={btnGhost}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={btnPrimary}
              >
                Save Changes
              </button>
            </div>
          </motion.form>

        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
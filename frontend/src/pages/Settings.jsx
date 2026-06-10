import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { VscChevronLeft } from "react-icons/vsc";
import { HiOutlineCamera, HiOutlineArrowUpTray } from "react-icons/hi2";
import { updateDisplayPicture, updateProfile ,deleteProfile } from "../services/operations/profileApi";
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

// YOUR ORIGINAL BUTTON DESIGNS (Kept exactly as they were)
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
    /* Changed page bg to bg-gray-50 so white cards look perfectly separated */
    <div
      className="min-h-screen w-full bg-gray-50 pt-24 pb-20 flex flex-col gap-6"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-3xl px-5 sm:px-8"
      >
        

        <motion.div variants={fadeUp} className="mb-10 border-b border-gray-200 pb-8">
          <p className="mb-1  font-bold text-black-500 text-2xl">
            codevolve<span className="text-indigo-600">X</span>
          </p>
          <h1 className="text-[32px] font-bold tracking-tight text-gray-900">
            Account Settings
          </h1>
          <p className="mt-1.5 text-sm text-gray-400">
            Update your photo and personal details.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">

          {/* Card Module 1: Added distinct border-gray-200 and shadow-md */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-gray-200 bg-white shadow-md"
          >
            <div className="border-b border-gray-200 px-7 py-4">
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

          {/* Card Module 2: Added distinct border-gray-200 and shadow-md */}
          <motion.form
            variants={fadeUp}
            onSubmit={handleFormSubmit}
            className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden"
          >
            <div className="border-b border-gray-200 px-7 py-4">
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

            {/* Kept original bg-gray-50/60 for form footer as it contrasts cleanly against card's main white body */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50/60 px-7 py-4">
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

 
<motion.div
  variants={fadeUp}
  className="rounded-2xl border w-[60rem] m-auto   border-red-300 bg-white shadow-md overflow-hidden"
>
  <div className="border-b border-red-200 bg-red-200/60 px-7 py-4 flex items-center gap-2.5">
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M6 1L11 10H1L6 1Z" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M6 4.5V7" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="6" cy="9" r="0.6" fill="#ef4444"/>
      </svg>
    </span>
    <h3 className="text-[13px] font-bold uppercase tracking-widest text-red-600">
      Danger Zone
    </h3>
  </div>

  <div className="flex items-center justify-between gap-6 px-7 py-6">
    <div className="flex flex-col gap-1">
      <p className="text-[14px] font-semibold text-gray-900">Delete Account</p>
      <p className="text-[12px] text-gray-400 max-w-sm">
        Permanently delete your account and all associated data. This action cannot be undone.
      </p>
    </div>
    <button
      onClick={() => dispatch(deleteProfile(token, navigate))}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
        backgroundColor: "#fff",
        border: "1px solid #fca5a5",
        borderRadius: "0.5rem",
        padding: "0.5rem 1.25rem",
        fontSize: "13px",
        fontWeight: 600,
        color: "#dc2626",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background-color 0.15s, border-color 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = "#fef2f2";
        e.currentTarget.style.borderColor = "#f87171";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = "#fff";
        e.currentTarget.style.borderColor = "#fca5a5";
      }}
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M2 3.5h10M5 3.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.3a.5.5 0 0 0 .5.45h5.6a.5.5 0 0 0 .5-.45L11 3.5" stroke="#dc2626" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Delete Account
    </button>
  </div>
</motion.div>

    </div>
  );
};

export default Settings;
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VscEdit, VscMail, VscCalendar, VscDeviceMobile } from 'react-icons/vsc';
import { HiOutlineUser, HiOutlineIdentification } from 'react-icons/hi2';
import { PiGenderIntersexBold } from 'react-icons/pi';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

const DetailField = ({ icon: Icon, label, value, placeholder = '—' }) => (
  <div className="flex flex-col gap-1.5">
    <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-400">
      {Icon && <Icon className="text-[14px]" />}
      {label}
    </dt>
    <dd className={`text-[15px] font-medium ${value ? 'text-indigo-950' : 'text-slate-300'}`}>
      {value || placeholder}
    </dd>
  </div>
);

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  if (!user) return null;

  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const details = user?.additionalDetails ?? {};

  return (
    <div className="min-h-screen w-full bg-slate-50 pt-24 pb-20 px-5">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-5xl"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-indigo-100 pb-8">
          <div>
            <p className="text-2xl font-bold text-slate-950 mb-1">codevolve<span className="text-indigo-600">X</span></p>
            <h1 className="text-3xl font-semibold tracking-tight text-indigo-950">My Profile</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your account details and settings.</p>
          </div>
          <Link to="/settings">
            <button className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]">
              <VscEdit size={16} /> Edit Profile
            </button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar Card */}
          <motion.div variants={fadeUp} className="md:col-span-1">
            <div className="bg-white rounded-3xl border border-indigo-50 p-8 shadow-[0_4px_24px_-8px_rgba(79,70,229,0.08)] text-center">
              <div className="relative inline-block mb-6">
                <img src={user?.image} alt={fullName} className="h-28 w-28 rounded-2xl object-cover ring-4 ring-slate-50 shadow-lg" />
                <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <h2 className="text-xl font-semibold text-indigo-950">{fullName}</h2>
              <p className="text-sm text-indigo-400 mt-1">{user?.email}</p>
              
              <div className="mt-6 inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                <HiOutlineIdentification size={14} /> {user?.accountType}
              </div>

              <div className="grid grid-cols-2 mt-8 border-t border-slate-100 pt-6">
                <div className="border-r border-slate-100">
                  <p className="text-xl font-semibold text-indigo-950">{user?.courses?.length ?? 0}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Courses</p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-indigo-950">Active</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details Column */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* About */}
            <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-indigo-50 p-8 shadow-[0_4px_24px_-8px_rgba(79,70,229,0.08)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">About</h3>
              <p className="text-[15px] leading-relaxed text-slate-600 italic">
                {details?.about ?? 'No bio added yet. Click Edit Profile to tell us more about yourself.'}
              </p>
            </motion.div>

            {/* Personal Details */}
            <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-indigo-50 p-8 shadow-[0_4px_24px_-8px_rgba(79,70,229,0.08)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-6">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                <DetailField icon={HiOutlineUser} label="First Name" value={user?.firstName} />
                <DetailField icon={HiOutlineUser} label="Last Name" value={user?.lastName} />
                <DetailField icon={VscMail} label="Email" value={user?.email} />
                <DetailField icon={VscDeviceMobile} label="Phone Number" value={details?.contactNumber} />
                <DetailField icon={PiGenderIntersexBold} label="Gender" value={details?.gender} />
                <DetailField icon={VscCalendar} label="Date of Birth" value={details?.dateOfBirth} />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile
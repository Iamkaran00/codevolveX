import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VscEdit, VscMail, VscCalendar, VscDeviceMobile } from 'react-icons/vsc';
import { HiOutlineUser, HiOutlineIdentification } from 'react-icons/hi2';
import { PiGenderIntersexBold } from 'react-icons/pi';
import { Link } from 'react-router-dom';
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const DetailField = ({ icon: Icon, label, value, placeholder = '—' }) => (
  <div className="group flex flex-col gap-1">
    <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
      {Icon && <Icon className="text-[13px] text-indigo-400" />}
      {label}
    </dt>
    <dd
      className={`text-[15px] font-medium leading-snug ${
        value ? 'text-gray-900' : 'text-gray-300'
      }`}
    >
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
     
    <div
      className="min-h-screen w-full bg-gray-50 pt-24 pb-20"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-5xl px-5 sm:px-8"
      >

        <motion.div
          variants={fadeUp}
          className="mb-10 flex flex-col gap-6 border-b border-black/50 pb-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-1 text-2xl font-bold  text-black-500">
              codevolve<span className='text-indigo-600'>X</span>
            </p>
            <h1 className="text-[32px] font-bold tracking-tight text-gray-900">
              My Profile
            </h1>
            <p className="mt-1.5 text-sm text-gray-400">
              View and manage your personal account details.
            </p>
          </div>
        <Link to = '/settings' >
          <button
            onClick={() => navigate('/settings')}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-600 hover:shadow-2xl px-4 py-2.5 text-sm font-semibold text-white-700 shadow-none transition-all duration-150  cursor-pointer  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98] text-white"
          >
            <VscEdit className="text-base" />
            Edit Profile
          </button>
          </Link>
        </motion.div>
 
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <motion.div variants={fadeUp} className="col-span-1 flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl border border-black/30 hover:shadow-black/60 transition-all bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.04)]">
              <div className="h-[5px] w-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-400" />

              <div className="flex flex-col items-center px-6 py-7 text-center">
                {/* Avatar */}
                <div className="relative mb-5">
                  <img
                    src={user?.image}
                    alt={fullName}
                    className="h-24 w-24 rounded-full border-[3px] border-white object-cover shadow-md"
                  />
                  <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
                </div>

                <h2 className="text-[19px] font-bold tracking-tight text-gray-900">
                  {fullName}
                </h2>
                <p className="mt-0.5 text-[13px] text-gray-400 truncate max-w-full px-2">
                  {user?.email}
                </p>

                {/* Account Type Badge */}
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-indigo-600">
                  <HiOutlineIdentification className="text-[12px]" />
                  {user?.accountType}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-6 border-t border-gray-100" />

              {/* Quick stats row */}
              <div className="grid grid-cols-2 divide-x divide-gray-100 px-0 py-4">
                {[
                  { label: 'Courses', value: user?.courses?.length ?? 0 },
                  { label: 'Status', value: 'Active' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center gap-0.5 py-1">
                    <span className="text-[17px] font-bold text-gray-900">{value}</span>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="col-span-1 flex flex-col gap-6 md:col-span-2">

            {/* About */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border-black/30 hover:shadow-black/60 transition-all bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-7 py-4">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-900">
                  About
                </h3>
              </div>
              <div className="px-7 py-5">
                <p
                  className={`text-[15px] leading-relaxed ${
                    details?.about
                      ? 'text-gray-700'
                      : 'italic text-gray-300'
                  }`}
                >
                  {details?.about ?? 'No bio added yet. Click Edit Profile to write one.'}
                </p>
              </div>
            </motion.div>

            {/* Personal Details */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border-black/30 hover:shadow-black/60 transition-all bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-7 py-4">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-900">
                  Personal Details
                </h3>
              </div>

              <div className="px-7 py-6">
                <dl className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
                  <DetailField
                    icon={HiOutlineUser}
                    label="First Name"
                    value={user?.firstName}
                  />
                  <DetailField
                    icon={HiOutlineUser}
                    label="Last Name"
                    value={user?.lastName}
                  />
                  <DetailField
                    icon={VscMail}
                    label="Email Address"
                    value={user?.email}
                  />
                  <DetailField
                    icon={VscDeviceMobile}
                    label="Phone Number"
                    value={details?.contactNumber}
                  />
                  <DetailField
                    icon={PiGenderIntersexBold}
                    label="Gender"
                    value={details?.gender}
                  />
                  <DetailField
                    icon={VscCalendar}
                    label="Date of Birth"
                    value={details?.dateOfBirth}
                  />
                </dl>
              </div>
            </motion.div>

            {/* Security / Account row */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border-black/30 hover:shadow-black/60 transition-all bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-7 py-4">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-900">
                  Account
                </h3>
              </div>
              <div className="px-7 py-5">
                <dl className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
                  <DetailField
                    label="Account Type"
                    value={user?.accountType}
                  />
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                      Password
                    </dt>
                    <dd className="text-[15px] font-medium text-gray-900 tracking-[0.2em]">
                      ••••••••••
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile;
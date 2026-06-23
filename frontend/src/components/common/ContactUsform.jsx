import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { apiConnector } from "../../services/apiconnector"
import { endpoints } from "../../services/apis"
import countryCode from "../../data/countryCode.js"
import { toast } from "react-toastify"

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()
  
  const { CONTACTUS_API } = endpoints;

  const submitContactForm = async (data) => {
    try {
      setLoading(true)
      await apiConnector("POST", CONTACTUS_API, data)
      toast.success("information sent successfully")
      setLoading(false)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ email: "", firstname: "", lastname: "", message: "", phoneNo: "" })
    }
  }, [reset, isSubmitSuccessful])

  const labelClasses = "text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 transition-colors duration-300 mb-2 block"
  const inputClasses = "w-full bg-transparent border-b-2 border-slate-200 py-3 text-slate-900 text-lg font-medium placeholder:text-slate-300 focus:border-indigo-600 focus:outline-none transition-all duration-300 rounded-none px-0"
  const errorClasses = "absolute -bottom-6 left-0 text-[10px] font-bold uppercase tracking-widest text-red-500"

  const ErrorMsg = ({ show, msg }) => (
    <AnimatePresence>
      {show && (
        <motion.span 
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
          className={errorClasses}
        >
          {msg}
        </motion.span>
      )}
    </AnimatePresence>
  )

  return (
    <form className="flex w-full flex-col gap-10 p-4 sm:p-8" onSubmit={handleSubmit(submitContactForm)}>
      
      {/* Name Row */}
      <div className="flex flex-col gap-10 md:flex-row md:gap-12">
        <div className="relative flex w-full flex-col md:w-1/2">
          <label htmlFor="firstname" className={`${labelClasses} ${focusedField === 'firstname' ? 'text-indigo-600' : ''}`}>First Name</label>
          <input
            type="text" id="firstname" placeholder="Jane" className={inputClasses}
            onFocus={() => setFocusedField('firstname')} onBlur={() => setFocusedField(null)}
            {...register("firstname", { required: true })}
          />
          <ErrorMsg show={errors.firstname} msg="Required" />
        </div>
        <div className="relative flex w-full flex-col md:w-1/2">
          <label htmlFor="lastname" className={`${labelClasses} ${focusedField === 'lastname' ? 'text-indigo-600' : ''}`}>Last Name</label>
          <input
            type="text" id="lastname" placeholder="Doe" className={inputClasses}
            onFocus={() => setFocusedField('lastname')} onBlur={() => setFocusedField(null)}
            {...register("lastname")}
          />
        </div>
      </div>

      {/* Email */}
      <div className="relative flex flex-col">
        <label htmlFor="email" className={`${labelClasses} ${focusedField === 'email' ? 'text-indigo-600' : ''}`}>Email Address</label>
        <input
          type="email" id="email" placeholder="hello@example.com" className={inputClasses}
          onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
          {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
        />
        <ErrorMsg show={errors.email} msg="Valid email required" />
      </div>

      {/* Phone */}
      <div className="relative flex flex-col">
        <label htmlFor="phonenumber" className={`${labelClasses} ${focusedField === 'phone' ? 'text-indigo-600' : ''}`}>Phone Number</label>
        <div className="flex gap-4">
          <div className="w-[110px] shrink-0 relative">
            <select
              className={`${inputClasses} cursor-pointer appearance-none bg-none pr-6`}
              {...register("countrycode", { required: true })} defaultValue="+91"
            >
              {countryCode.map((ele, i) => (
                <option key={i} value={ele.code}>{ele.code} {ele.country}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          <div className="w-full">
            <input
              type="tel" id="phonenumber" placeholder="000 000 0000" className={inputClasses}
              onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)}
              {...register("phoneNo", { required: { value: true, message: "Required" }, maxLength: 12, minLength: 10 })}
            />
          </div>
        </div>
        <ErrorMsg show={errors.phoneNo} msg={errors.phoneNo?.message || "Invalid length"} />
      </div>

      {/* Message */}
      <div className="relative flex flex-col">
        <label htmlFor="message" className={`${labelClasses} ${focusedField === 'message' ? 'text-indigo-600' : ''}`}>Message</label>
        <textarea
          id="message" rows="1" placeholder="How can we help you?"
          className={`${inputClasses} resize-none min-h-[60px]`}
          onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
          {...register("message", { required: true })}
        />
        <ErrorMsg show={errors.message} msg="Required" />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          disabled={loading} type="submit"
          className="group relative inline-flex h-16 w-full items-center justify-center overflow-hidden bg-slate-900 px-12 font-bold text-white transition-all disabled:opacity-50"
        >
          <span className="absolute inset-0 h-full w-full bg-indigo-600 transition-all duration-500 ease-out -translate-x-full group-hover:translate-x-0"></span>
          <span className="relative z-10 flex items-center gap-3 text-sm tracking-[0.2em] uppercase">
            {loading ? "Processing..." : (
              <>
                Send Message
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  )
}

export default ContactUsForm
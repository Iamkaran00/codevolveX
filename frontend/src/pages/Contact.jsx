import React from "react"
import { Footer } from "../components/common/Footer"
import ContactUsForm from "../components/common/ContactUsform"

const contactDetails = [
  {
    icon: "💬",
    heading: "Chat with us",
    description: "Our AI agents and human mentors are here to help.",
    details: "support@codevolvex.com",
  },
  {
    icon: "🌍",
    heading: "Visit us",
    description: "Our engineering hub in the heart of MP.",
    details: "Jabalpur, Madhya Pradesh, India",
  },
  {
    icon: "📞",
    heading: "Call us",
    description: "Mon - Fri From 8am to 5pm.",
    details: "+91-7440682926",
  },
]

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="mx-auto flex w-11/12 max-w-7xl flex-col justify-between gap-16 py-20 lg:flex-row lg:py-32">
        
        {/* Contact Details (Left Side) */}
        <div className="flex flex-col gap-10 lg:w-[35%]">
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Get in Touch</h2>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Let's connect
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              We’re here to help you accelerate your engineering journey. Choose your preferred channel.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {contactDetails.map((element, index) => (
              <div
                className="group flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50"
                key={index}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                  {element.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{element.heading}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{element.description}</p>
                  <p className="mt-2 text-sm font-bold text-indigo-600">{element.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section (Right Side) */}
        <div className="lg:w-[55%]">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/60 sm:p-12">
            <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Send us a message
            </h2>
            <p className="mb-10 text-slate-500 font-medium">
              Whether you are looking to accelerate your engineering career, report a bug, or partner with us—drop a message below.
            </p>
            
            <ContactUsForm />
          </div>
        </div>
        
      </div>
      
    </div>
  )
}

export default Contact
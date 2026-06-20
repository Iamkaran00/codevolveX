import React from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { BookOpen, Users, Clock, Globe, Award, Zap, ShoppingCart, RefreshCw, ArrowRight } from "lucide-react"
import { useSelector,useDispatch } from "react-redux"
import { addToCart } from "../../../slices/cart.slice"
import { buyCourse } from "../../../services/operations/paymentAPI"
import { toast } from "react-toastify"
export default function CourseDetailsCard({ course, totalDuration, user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const enrolled = course.studentsEnrolled?.length ?? 0;
  const isEnrolled = course.studentsEnrolled?.includes(user._id);
  
  const {cart} = useSelector(state => state.cart);
  const isCourseInCart = cart.some(item => item._id === course?._id) ;
  const {token} = useSelector(state => state.auth) ;
  const handleAddToCart = () => {

  if(isCourseInCart) {
   navigate('/dashboard/mycart') ;
   return ;
  }
   dispatch(addToCart(course));
  }

  const handleBuyCourse = () => {
    if(!token) {
      toast.error('Please login to enroll') ;
      navigate('/login');
      return;
    }
    if(user?.accountType === 'Instructor') {
      toast.error('Instructor cannot access this');
      return;
    }
    const courses = [course._id];
    buyCourse(token,courses,user,navigate,dispatch) ;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-[0_24px_48px_-12px_rgba(79,70,229,0.12)] sticky top-24">
 
      <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-indigo-50">
            <BookOpen size={48} className="text-indigo-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4">
          {course.price === 0 ? (
            <span className="bg-emerald-500 text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg">
              Free
            </span>
          ) : (
            <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-sm font-black px-3 py-1.5 rounded-full shadow-lg">
              ₹{course.price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-5">

        <div className="flex items-baseline gap-2">
          {course.price === 0 ? (
            <span className="text-emerald-600 font-black text-4xl tracking-tight">Free</span>
          ) : (
            <span className="text-slate-900 font-black text-4xl tracking-tight">
              ₹{course.price?.toLocaleString("en-IN")}
            </span>
          )}
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">one-time</span>
        </div>
 
        {user?.accountType?.toLowerCase() === "student" && (
          <div className="flex flex-col gap-3">
{
  !isEnrolled ? (  <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBuyCourse}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base py-4 rounded-2xl transition-colors shadow-lg shadow-indigo-200"
            >
              <Zap size={18} />
              Enroll Now
            </motion.button>) : (  <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={()=>navigate(`/dashboard/view-courses/${course._id}`)}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base py-4 rounded-2xl transition-colors shadow-lg shadow-indigo-200"
            >
              <Zap size={18} />
              Continue Learning
            </motion.button>)
}




          

            {
              isCourseInCart ? (
                <Link to = '/dashboard/mycart' >
                <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}  
              className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-base py-4 rounded-2xl border border-slate-200 transition-colors"
            > 
                Already In Cart
              <ArrowRight size={18} />
            
            </motion.button>
                </Link>
             ) : ( !isEnrolled && <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }} onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-base py-4 rounded-2xl border border-slate-200 transition-colors"
            > 
              <ShoppingCart size={18} />
              Add to Cart
            </motion.button>)


            }
           

            <p className="text-center text-xs font-medium text-slate-400 flex items-center justify-center gap-1.5">
              <RefreshCw size={11} />
              30-day money back guarantee
            </p>
          </div>
        )}

        

        <div className="border-t border-slate-100" />

        <div className="space-y-3">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            This course includes
          </p>
          {[
            { icon: Users,  label: `${enrolled.toLocaleString()} students already enrolled` },
            { icon: Clock,  label: `${totalDuration} of on-demand content` },
            { icon: Globe,  label: "Full lifetime access" },
            { icon: Award,  label: "Certificate of completion" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 text-sm font-medium text-slate-600"
            >
              <div className="w-7 h-7 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-indigo-400" />
              </div>
              {label}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
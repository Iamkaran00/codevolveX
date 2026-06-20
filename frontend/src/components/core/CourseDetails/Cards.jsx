import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from '../../../slices/cart.slice'
import { ArrowRight, ShoppingBag, ShoppingCart } from "lucide-react";
export function CourseDetailsCard({ course, totalDuration, user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // reading cart state from redux store 

  const {cart} = useSelector(state=>state.cart) ;

  const isEnrolled = course?.studentsEnrolled?.includes(user?._id) ;
  const isCourseInCart = cart.some(item => item._id === course?._id) ;
  const rating = course.ratingAndReviews?.length
    ? course.ratingAndReviews.reduce((s, r) => s + r.rating, 0) / course.ratingAndReviews.length
    : 0;
  const enrolled = course.studentsEnrolled?.length ?? 0;
  
  const handleAddToCart =() => {
    if(isCourseInCart) {
        navigate('/dashboard/mycart');
        return ;
    }
    dispatch(addToCart(course));
  }


  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-[0_20px_40px_-15px_rgba(79,70,229,0.1)] sticky top-24">
      <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen size={48} className="text-slate-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
      </div>
 
      <div className="p-6 space-y-5">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p>
          {course.price === 0 ? (
            <span className="text-emerald-600 font-black text-4xl tracking-tight">Free</span>
          ) : (
            <span className="text-slate-900 font-black text-4xl tracking-tight">
              ₹{course.price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>
 
        {user?.accountType === "Student" && (
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base py-4 rounded-2xl transition-colors shadow-lg shadow-indigo-200"
            >
              <Zap size={18} />
              Enroll Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-base py-4 rounded-2xl border border-slate-200 transition-colors"
            >
              {

                isCourseInCart ? (
                    <>
                    Go to Cart <ArrowRight size={18}/>
                    </>
                ) : ( <>
                    <ShoppingCart size = {18} /> Add to Cart
                    </>
                )
              }
              
            </motion.button>
          </div>
        )}
 
        <div className="pt-2 space-y-3 border-t border-slate-100">
          {[
            { icon: Users, label: `${enrolled.toLocaleString()} students enrolled` },
            { icon: Clock, label: `${totalDuration} total duration` },
            { icon: Globe, label: "Full lifetime access" },
            { icon: Award, label: "Certificate of completion" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <Icon size={16} className="text-slate-400 shrink-0" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
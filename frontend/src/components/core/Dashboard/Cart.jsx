import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { HiOutlineTrash, HiOutlineShoppingBag } from "react-icons/hi2";
import ReactStars from "react-rating-stars-component";
import { removeFromCart,resetCart } from "../../../slices/cart.slice";


const Cart = () => {
  const { total, totalItems, cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBuyCourse = () => {
    if (!token) return;
    const courses = cart.map((course) => course._id);
    buyCourse(token, courses, user, navigate, dispatch);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/30">
      
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Your Cart</h1>
        <p className="mt-1.5 text-sm font-semibold text-slate-400">
          {totalItems} {totalItems === 1 ? "Course" : "Courses"} currently queued in checkout workflow
        </p>
      </div>

      {total > 0 ? (
        <div className="flex flex-col-reverse items-start gap-8 lg:flex-row">
          
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            {cart.map((course) => (
              <div
                key={course._id}
                className="flex w-full flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-md sm:flex-row justify-between items-start hover:border-indigo-100 transition-all duration-200"
              >
                <div className="flex flex-1 flex-col gap-4 sm:flex-row items-start sm:items-center">
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[100px] w-[160px] rounded-xl object-cover border border-slate-100 shadow-sm shrink-0"
                  />
                  <div className="flex flex-col space-y-1 truncate max-w-[240px] sm:max-w-md">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {course?.courseName}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600">
                      {course?.category?.name || "Programming Route"}
                    </p>
                    
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs font-bold text-amber-500">4.5</span>
                      <ReactStars
                        count={5}
                        value={4.5}
                        size={15}
                        edit={false}
                        activeColor="#f59e0b"
                        emptyIcon={<FaStar />}
                        fullIcon={<FaStar />}
                      />
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({course?.ratingAndReviews?.length || 0} Ratings)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing Tag Details and Removal Actions Panel */}
                <div className="flex w-full sm:w-auto flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t border-slate-100 pt-3 sm:border-none sm:pt-0 shrink-0">
                  <p className="text-2xl font-black text-slate-900">
                    ₹ {course?.price}
                  </p>
                  <button
                    onClick={() => dispatch(removeFromCart(course._id))}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50/60 px-3 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-100 active:scale-[0.97]"
                  >
                    <HiOutlineTrash className="text-sm" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-start mt-2">
              <button
                onClick={() => dispatch(resetCart())}
                className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors px-2 py-1"
              >
                Clear Entire Queue
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[300px] rounded-2xl border border-slate-200 bg-white p-6 shadow-md shrink-0 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Order Balance:
            </p>
            <p className="mt-1 text-3xl font-black text-slate-900 tracking-tight">
              ₹ {total}
            </p>
            
            <button
              onClick={handleBuyCourse}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-[0.98]"
            >
              <HiOutlineShoppingBag className="text-base" />
              <span>Checkout Order</span>
            </button>

            <p className="text-[11px] text-center text-slate-400 mt-3 font-medium">
              Secure Razorpay gateway transactions
            </p>
          </div>

        </div>
      ) : (
        <div className="flex h-[360px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-md text-center overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.02),transparent_60%)] pointer-events-none" />
          
          <div className="relative mb-5 flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Your selection bundle is empty
          </h3>
          <p className="text-sm text-slate-400 mt-1.5 max-w-xs leading-relaxed">
            Looks like you haven't appended any developer tracks to your checkout tray.
          </p>
          
          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-[0.98]"
          >
            Explore Catalog Pathways
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
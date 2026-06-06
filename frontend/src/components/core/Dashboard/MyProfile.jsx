// import { RiEditBoxLine } from "react-icons/ri";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { formattedDate } from "../../../utils/formattedDate";
// import IconBtn from "../../common/IconBtn";
// export default function MyProfile() {
//   const { user } = useSelector((state) => state.profile);
//   const navigate = useNavigate();
//   return (
//     <>
//       <h1>My Profile</h1>
//       <div>
//         <div>
//           <img src={user?.image} alt={`profile-${user?.firstName}`} />
//           <div>
//             <p>{user?.firstName + " " + user?.lastName}</p>
//             <p>{user?.email}</p>
//           </div>
//         </div>
//         <IconBtn
//           text="Edit"
//           onclick={() => {
//             navigate("/dashboard/settings");
//           }}
//         >
//           <RiEditBoxLine />
//         </IconBtn>
//       </div>
//       <div>
//         <div>
//           <p>About</p>
//           <IconBtn
//             text="Edit"
//             onclick={() => {
//               navigate("/dashboard/settings");
//             }}
//           >
//             <RiEditBoxLine />
//           </IconBtn>
//         </div>
//         <p>
//           {user?.additionalDetails?.about ?? "Write Something about yourself"}
//         </p>
//       </div>
//       <div>
//         <div>
//           <p>Personal Details</p>
//           <IconBtn
//             text="Edit"
//             onclick={() => {
//               navigate("/dashboard/settings");
//             }}
//           >
//             <RiEditBoxLine />
//           </IconBtn>
//         </div>
//         <div>
//           <div>
//             <div>
//               <p>First Name</p>
//               <p>{user?.firstName}</p>
//             </div>
//             <div>
//               <p>Gender</p>
//               <p>{user?.additionalDetails?.gender ?? "Add Gender"}</p>
//             </div>
//           </div>
//           <div>
//             <div>
//               <p>Last Name</p>
//               <p>{user?.lastName}</p>
//             </div>
//             <div>
//               <p>Phone Number</p>
//               <p>
//                 {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
//               </p>
//             </div>
//             <div>
//               <p>Date of Birth</p>
//               <p>
//                 {formattedDate(user?.additionalDetails?.dateOfBirth) ??
//                   "Add Date Of Birth"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

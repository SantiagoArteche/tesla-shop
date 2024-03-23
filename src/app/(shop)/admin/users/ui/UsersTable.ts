// "use client";

// import { Role } from "@prisma/client";
// import { User } from "next-auth";

// export const UsersTable = ({ users }: any) => {
//   return (
//     <div>
//       <Title title="Orders" />
//       <div className="mb-10">
//         <table className="min-w-full">
//           <thead className="bg-gray-200 border-b">
//             <tr>
//               <th
//                 scope="col"
//                 className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
//               >
//                 Email
//               </th>
//               <th
//                 scope="col"
//                 className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
//               >
//                 Full Name
//               </th>
//               <th
//                 scope="col"
//                 className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
//               >
//                 Update Role
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {users?.map((user) => {
//               return (
//                 <tr
//                   className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
//                   key={user!.id}
//                 >
//                   <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
//                     {user.email}
//                   </td>
//                   <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
//                     {user.name}
//                   </td>
//                   <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
//                     <select
//                       value={user.role}
//                       onChange={(e) => console.log(e)}
//                       className="text-sm text-gray-900"
//                     >
//                       <option value="admin">Admin</option>
//                       <option value="user">User</option>
//                     </select>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

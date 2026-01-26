"use client";

// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// type Section = "active" | "plans" | "manage";

// interface Subscription {
//   id: number;
//   user: string;
//   plan: string;
//   startDate: string;
//   status: "active" | "cancelled" | "past_due";
// }

// interface Plan {
//   id: number;
//   name: string;
//   price: number;
//   interval: "monthly" | "yearly";
//   active: boolean;
// }

// interface Props {
//   section: Section;
//   subscriptions?: Subscription[];
//   plans?: Plan[];
//   onCancel?: (id: number) => void;
//   onUpgrade?: (id: number, planId: number) => void;
//   onAddPlan?: (plan: Plan) => void;
//   onEditPlan?: (planId: number) => void;
//   onTogglePlan?: (planId: number) => void;
// }

export default function SubscriptionTable() {
  //   const { section } = props;

  //   if (section === "active") {
  //     const subscriptions = props.subscriptions || [];
  return <div></div>;
  // return (
  //   <div className="rounded-md border">
  //     <Table>
  //       <TableHeader>
  //         <TableRow>
  //           <TableHead>Subscriber</TableHead>
  //           <TableHead>Plan</TableHead>
  //           <TableHead>Start Date</TableHead>
  //           <TableHead>Status</TableHead>
  //           <TableHead>Actions</TableHead>
  //         </TableRow>
  //       </TableHeader>
  //       <TableBody>
  //         {subscriptions.length ? (
  //           subscriptions.map((s) => (
  //             <TableRow key={s.id}>
  //               <TableCell>{s.user}</TableCell>
  //               <TableCell>{s.plan}</TableCell>
  //               <TableCell>{s.startDate}</TableCell>
  //               <TableCell>
  //                 <Badge
  //                   variant={
  //                     s.status === "active"
  //                       ? "secondary"
  //                       : s.status === "past_due"
  //                         ? "destructive"
  //                         : "outline"
  //                   }
  //                 >
  //                   {s.status}
  //                 </Badge>
  //               </TableCell>
  //               <TableCell>
  //                 <div className="flex items-center gap-2">
  //                   <Button
  //                     size="sm"
  //                     variant="destructive"
  //                     onClick={() => props.onCancel?.(s.id)}
  //                   >
  //                     Cancel
  //                   </Button>
  //                   <Button
  //                     size="sm"
  //                     onClick={() =>
  //                       props.onUpgrade?.(s.id, /* planId placeholder */ 0)
  //                     }
  //                   >
  //                     Upgrade
  //                   </Button>
  //                 </div>
  //               </TableCell>
  //             </TableRow>
  //           ))
  //         ) : (
  //           <TableRow>
  //             <TableCell colSpan={5} className="h-24 text-center">
  //               No active subscriptions.
  //             </TableCell>
  //           </TableRow>
  //         )}
  //       </TableBody>
  //     </Table>
  //   </div>
  // );
}

//   if (section === "plans") {
//     const plans = props.plans || [];
//     return (
//       <div className="space-y-4">
//         <div className="rounded-md border">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Plan</TableHead>
//                 <TableHead>Price</TableHead>
//                 <TableHead>Interval</TableHead>
//                 <TableHead>Active</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {plans.length ? (
//                 plans.map((p) => (
//                   <TableRow key={p.id}>
//                     <TableCell>{p.name}</TableCell>
//                     <TableCell>${p.price.toFixed(2)}</TableCell>
//                     <TableCell>{p.interval}</TableCell>
//                     <TableCell>
//                       <Badge variant={p.active ? "secondary" : "destructive"}>
//                         {p.active ? "Yes" : "No"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <Button
//                           size="sm"
//                           onClick={() => props.onEditPlan?.(p.id)}
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           onClick={() => props.onTogglePlan?.(p.id)}
//                         >
//                           {p.active ? "Deactivate" : "Activate"}
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={5} className="h-24 text-center">
//                     No plans configured.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     );
//   }

// manage cancellations and upgrades
//   const subscriptions = props.subscriptions || [];
//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Subscriber</TableHead>
//             <TableHead>Plan</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {subscriptions.length ? (
//             subscriptions.map((s) => (
//               <TableRow key={s.id}>
//                 <TableCell>{s.user}</TableCell>
//                 <TableCell>{s.plan}</TableCell>
//                 <TableCell>
//                   <Badge
//                     variant={
//                       s.status === "active" ? "secondary" : "destructive"
//                     }
//                   >
//                     {s.status}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       onClick={() => props.onCancel?.(s.id)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       size="sm"
//                       onClick={() =>
//                         props.onUpgrade?.(s.id, /* planId placeholder */ 0)
//                       }
//                     >
//                       Upgrade
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={4} className="h-24 text-center">
//                 No subscription items.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// import { motion } from "framer-motion";
// import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
// import type { InventoryEntry } from "@/data/mockData";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// interface InventoryLogProps {
//   entries: InventoryEntry[];
// }

// const InventoryLog = ({ entries }: InventoryLogProps) => {
//   return (
//     <div className="overflow-x-auto -mx-6 px-6">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Type</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead className="hidden sm:table-cell">Date</TableHead>
//             <TableHead className="text-right">Amount</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {entries.map((entry, index) => (
//             <motion.tr
//               key={entry.id}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: index * 0.05 }}
//               className="hover:bg-muted/50 transition-colors"
//             >
//               <TableCell>
//                 <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
//                   entry.type === 'purchase' 
//                     ? 'bg-primary/10 text-primary' 
//                     : 'bg-destructive/10 text-destructive'
//                 }`}>
//                   {entry.type === 'purchase' ? (
//                     <ArrowDownCircle className="w-3 h-3" />
//                   ) : (
//                     <ArrowUpCircle className="w-3 h-3" />
//                   )}
//                   {entry.type === 'purchase' ? 'Purchase' : 'Expense'}
//                 </div>
//               </TableCell>
//               <TableCell className="font-medium">{entry.description}</TableCell>
//               <TableCell className="text-muted-foreground hidden sm:table-cell">
//                 {new Date(entry.date).toLocaleDateString('en-IN', {
//                   day: 'numeric',
//                   month: 'short',
//                   year: 'numeric',
//                 })}
//               </TableCell>
//               <TableCell className="text-right font-semibold">
//                 ₹{entry.amount.toLocaleString('en-IN')}
//               </TableCell>
//             </motion.tr>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default InventoryLog;

import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
// Remove type import if it causes issues, or ensure path is correct
// import type { InventoryEntry } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define locally if needed to avoid circular dep issues
interface InventoryEntry {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'purchase' | 'expense';
}

interface InventoryLogProps {
  entries: InventoryEntry[];
}

const InventoryLog = ({ entries }: InventoryLogProps) => {
  // CRITICAL FIX: Handle undefined/null entries
  if (!entries || entries.length === 0) {
    return (
       <div className="p-6 text-center text-muted-foreground bg-card rounded-2xl border border-border">
         No inventory logs available.
       </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
      <h3 className="font-display text-xl font-semibold mb-4">Recent Stock Logs</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                    entry.type === 'purchase' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {entry.type === 'purchase' ? (
                      <ArrowDownCircle className="w-3 h-3" />
                    ) : (
                      <ArrowUpCircle className="w-3 h-3" />
                    )}
                    {entry.type === 'purchase' ? 'Purchase' : 'Expense'}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{entry.description}</TableCell>
                <TableCell className="text-muted-foreground hidden sm:table-cell">
                  {new Date(entry.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ₹{entry.amount.toLocaleString('en-IN')}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryLog;
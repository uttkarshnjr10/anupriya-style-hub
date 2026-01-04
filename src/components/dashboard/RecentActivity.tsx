import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { SaleRecord } from "@/data/mockData";

interface RecentActivityProps {
  sales: SaleRecord[];
}

const RecentActivity = ({ sales }: RecentActivityProps) => {
  return (
    <div className="space-y-3">
      {sales.slice(0, 5).map((sale, index) => (
        <motion.div
          key={sale.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
        >
          <div className="w-10 h-10 rounded-full gradient-royal flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">
              {sale.soldBy.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{sale.productName}</p>
            <p className="text-xs text-muted-foreground">{sale.category}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-success">₹{sale.price.toLocaleString('en-IN')}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {sale.time}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RecentActivity;

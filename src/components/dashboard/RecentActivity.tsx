import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  sales: any[]; 
}

const RecentActivity = ({ sales }: RecentActivityProps) => {
  if (!sales || sales.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground text-sm bg-muted/20 rounded-xl border border-dashed border-border">
        No recent sales recorded today.
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
      <h3 className="font-display text-xl font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {sales.map((sale, index) => {
          // Robust fallback for data fields
          const productName = sale.productSnapshot?.name || sale.productName || "Unknown Product";
          const category = sale.productSnapshot?.category || sale.category || "General";
          const amount = sale.amount || sale.price || 0;
          const staffName = sale.staffId?.name || sale.soldBy || "Unknown";
          const staffInitial = staffName.charAt(0);
          
          let timeDisplay = "";
          try {
             timeDisplay = sale.createdAt ? formatDistanceToNow(new Date(sale.createdAt), { addSuffix: true }) : "Recently";
          } catch (e) { timeDisplay = "Recently"; }

          return (
            <motion.div
              key={sale._id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
            >
              {/* Avatar - prevent shrinking on mobile */}
              <div className="w-10 h-10 rounded-full gradient-royal flex items-center justify-center flex-shrink-0 shadow-sm text-white font-bold text-sm">
                {staffInitial}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate text-sm sm:text-base">{productName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{category}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{staffName}</span>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-success text-sm sm:text-base">₹{amount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" />
                  {timeDisplay.replace("about ", "")}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
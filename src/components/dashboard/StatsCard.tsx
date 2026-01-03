import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: LucideIcon;
  index: number;
  variant?: 'default' | 'gold' | 'success';
}

const StatsCard = ({ title, value, trend, icon: Icon, index, variant = 'default' }: StatsCardProps) => {
  const variants = {
    default: 'bg-card border border-border',
    gold: 'gradient-gold text-foreground',
    success: 'bg-success/10 border border-success/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`rounded-2xl p-6 ${variants[variant]} shadow-soft`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${variant === 'gold' ? 'bg-white/20' : 'bg-primary/10'}`}>
          <Icon className={`w-6 h-6 ${variant === 'gold' ? 'text-foreground' : 'text-primary'}`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend >= 0 ? 'text-success' : 'text-destructive'
          }`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className={`text-sm font-medium mb-1 ${variant === 'gold' ? 'text-foreground/70' : 'text-muted-foreground'}`}>
        {title}
      </p>
      <p className="text-3xl font-bold font-display">{value}</p>
    </motion.div>
  );
};

export default StatsCard;

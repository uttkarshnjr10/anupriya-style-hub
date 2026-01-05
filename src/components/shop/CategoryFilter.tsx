// import { motion } from "framer-motion";

// interface CategoryFilterProps {
//   categories: string[];
//   activeCategory: string;
//   onCategoryChange: (category: string) => void;
// }

// const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
//   return (
//     <div className="flex flex-wrap gap-2 justify-center">
//       {categories.map((category) => (
//         <motion.button
//           key={category}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => onCategoryChange(category)}
//           className={`category-chip ${activeCategory === category ? 'active' : ''}`}
//         >
//           {category}
//         </motion.button>
//       ))}
//     </div>
//   );
// };

// export default CategoryFilter;

import { motion } from "framer-motion";

interface CategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

// Hardcoded categories to prevent crash
const CATEGORIES = ["All", "Men", "Women", "Kids"];

const CategoryFilter = ({ activeCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
      {CATEGORIES.map((category) => (
        <motion.button
          key={category}
          onClick={() => onSelectCategory(category)}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
            activeCategory === category
              ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
              : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
import React from 'react';
import Link from 'next/link';
import {
  Tv,
  Camera,
  Gamepad2,
  Armchair,
  Trophy,
  Wrench,
  Car,
  BookOpen,
  PartyPopper,
  Package,
  LucideIcon,
} from 'lucide-react';
import { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
}

const iconMap: Record<string, LucideIcon> = {
  Tv,
  Camera,
  Gamepad2,
  Armchair,
  Trophy,
  Wrench,
  Car,
  BookOpen,
  PartyPopper,
  Package,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const IconComponent = iconMap[category.icon] || Package;

  return (
    <Link
      href={`/browse?category=${category.slug}`}
      className="group relative flex flex-col p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-400 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
        <IconComponent className="w-6 h-6 transition-transform group-hover:scale-110" />
      </div>

      <h4 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
        {category.name}
      </h4>

      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
        {category.description}
      </p>

      <div className="mt-4 pt-2 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>{category.item_count || 12} items</span>
        <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">
          Explore →
        </span>
      </div>
    </Link>
  );
};

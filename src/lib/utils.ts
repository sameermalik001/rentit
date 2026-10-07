import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function calculateDaysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  if (diffTime < 0) return 0;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of end date
  return Math.max(1, diffDays);
}

export function calculatePricing({
  dailyPrice,
  startDate,
  endDate,
  securityDeposit = 0,
  commissionPercent = 10,
}: {
  dailyPrice: number;
  startDate: string;
  endDate: string;
  securityDeposit?: number;
  commissionPercent?: number;
}) {
  const totalDays = calculateDaysBetween(startDate, endDate);
  const rentalAmount = dailyPrice * totalDays;
  const platformFee = Math.round((rentalAmount * commissionPercent) / 100);
  const totalAmount = rentalAmount + platformFee + securityDeposit;
  const ownerPayout = rentalAmount;

  return {
    totalDays,
    dailyPrice,
    rentalAmount,
    platformFee,
    securityDeposit,
    totalAmount,
    ownerPayout,
  };
}

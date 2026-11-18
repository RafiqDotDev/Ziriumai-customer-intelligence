import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, symbol: string = "$"): string {
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return "No phone";
  const cleaned = phone.trim();
  if (cleaned.length < 7) return "••• •••";
  // e.g. +92 3•• •••4567 or 0300-•••-4567
  const start = cleaned.slice(0, cleaned.startsWith("+") ? 6 : 4);
  const end = cleaned.slice(-4);
  return `${start} ••• •••${end}`;
}

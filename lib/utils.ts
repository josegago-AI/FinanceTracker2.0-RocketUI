import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Format a number as a currency string.
 * Usage:
 *   formatCurrency(1234.5)                       -> "$1,234.50"
 *   formatCurrency(1234.5, { currency: "EUR" })  -> "€1,234.50"
 *   formatCurrency(1234.5, { locale: "en-GB" })  -> "£1,234.50"
 */
export function formatCurrency(
  value: number,
  options?: {
    currency?: string
    locale?: string
  } & Intl.NumberFormatOptions
): string {
  const { currency = "USD", locale, ...rest } = options ?? {}
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    ...rest,
  }).format(value ?? 0)
}
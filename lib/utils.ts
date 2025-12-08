import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number, currency: string = 'CNC') => {
  // Use pt-BR locale for formatting numbers (dots and commas)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD', // Keeping USD as the base fiat reference, or could switch to BRL
    minimumFractionDigits: 2
  }).format(value).replace('US$', '$') + ' ' + currency; // Clean up symbol slightly if needed
};
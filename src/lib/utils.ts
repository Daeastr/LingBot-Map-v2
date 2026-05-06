import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMs(ms: number) {
  return `${ms.toFixed(2)}ms`;
}

export function formatMetric(val: number, unit: string = '') {
  return `${val.toFixed(3)}${unit}`;
}

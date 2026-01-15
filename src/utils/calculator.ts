import dayjs from 'dayjs';
import { Rental } from '../types';

export const calculateRent = (rental: Rental): number => {
  const { startDate, endDate, rent, rentalType } = rental;
  const start = dayjs(startDate);
  const end = endDate ? dayjs(endDate) : dayjs();
  
  if (rentalType === 'daily') {
    const days = end.diff(start, 'day') + 1;
    return days * rent;
  } else {
    const months = end.diff(start, 'month');
    const remainingDays = end.diff(start.add(months, 'month'), 'day');
    const dailyRent = rent / 30;
    return months * rent + remainingDays * dailyRent;
  }
};

export const calculateTotalDue = (rental: Rental): number => {
  return calculateRent(rental);
};

export const calculateTotalPaid = (rental: Rental): number => {
  const paymentsTotal = rental.payments.reduce((sum, p) => sum + p.amount, 0);
  return rental.deposit + rental.otherFees + paymentsTotal;
};

export const calculateDailyPaid = (rental: Rental, date: string): number => {
  return rental.payments
    .filter(p => p.type === 'daily' && dayjs(p.date).isSame(dayjs(date), 'day'))
    .reduce((sum, p) => sum + p.amount, 0);
};

export const calculateMonthlyPaid = (rental: Rental, date: string): number => {
  return rental.payments
    .filter(p => p.type === 'monthly' && dayjs(p.date).isSame(dayjs(date), 'month'))
    .reduce((sum, p) => sum + p.amount, 0);
};

export const checkDailyPaymentComplete = (rental: Rental, date: string): boolean => {
  if (rental.rentalType !== 'daily') return true;
  const dailyPaid = calculateDailyPaid(rental, date);
  return dailyPaid >= rental.rent;
};

export const checkMonthlyPaymentComplete = (rental: Rental, date: string): boolean => {
  if (rental.rentalType !== 'monthly') return true;
  const monthlyPaid = calculateMonthlyPaid(rental, date);
  return monthlyPaid >= rental.rent;
};

export const calculateBalance = (rental: Rental): number => {
  const paymentsTotal = rental.payments.reduce((sum, p) => sum + p.amount, 0);
  return rental.deposit + rental.rent - paymentsTotal;
};

export const calculateProfit = (rental: Rental): number => {
  return rental.deposit + rental.rent - rental.otherFees;
};

export const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

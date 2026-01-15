export type RentalType = 'daily' | 'monthly';
export type PaymentType = 'daily' | 'monthly';

export interface Payment {
  id: string;
  amount: number;
  date: string;
  type: PaymentType;
  notes?: string;
  createdAt: string;
}

export interface Rental {
  id: string;
  tenantName: string;
  itemName: string;
  quantity: number;
  startDate: string;
  endDate: string | null;
  deposit: number;
  otherFees: number;
  rent: number;
  rentalType: RentalType;
  isSettled: boolean;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface ReminderSettings {
  enabled: boolean;
  dailyReminder: boolean;
  dailyTime: string;
  monthlyReminder: boolean;
  monthlyDay: number;
}

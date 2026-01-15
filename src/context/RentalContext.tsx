import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Rental, ReminderSettings, Payment } from '../types';
import { storage } from '../utils/storage';
import { startReminderService, stopReminderService, requestNotificationPermission } from '../utils/reminder';

interface RentalContextType {
  rentals: Rental[];
  reminderSettings: ReminderSettings;
  addRental: (rental: Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRental: (id: string, rental: Partial<Rental>) => void;
  deleteRental: (id: string) => void;
  settleRental: (id: string) => void;
  addPayment: (rentalId: string, payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  updatePayment: (rentalId: string, paymentId: string, payment: Partial<Payment>) => void;
  deletePayment: (rentalId: string, paymentId: string) => void;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const RentalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    enabled: true,
    dailyReminder: true,
    dailyTime: '09:00',
    monthlyReminder: true,
    monthlyDay: 1
  });

  useEffect(() => {
    const savedRentals = storage.getRentals();
    const savedSettings = storage.getReminderSettings();
    setRentals(savedRentals);
    setReminderSettings(savedSettings);
    
    requestNotificationPermission();
    startReminderService(savedRentals);
    
    return () => {
      stopReminderService();
    };
  }, []);

  useEffect(() => {
    storage.saveRentals(rentals);
    startReminderService(rentals);
  }, [rentals]);

  useEffect(() => {
    storage.saveReminderSettings(reminderSettings);
  }, [reminderSettings]);

  const addRental = (rental: Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRental: Rental = {
      ...rental,
      id: Date.now().toString(),
      payments: rental.payments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRentals([...rentals, newRental]);
  };

  const updateRental = (id: string, updates: Partial<Rental>) => {
    setRentals(rentals.map(r => 
      r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
    ));
  };

  const deleteRental = (id: string) => {
    setRentals(rentals.filter(r => r.id !== id));
  };

  const settleRental = (id: string) => {
    setRentals(rentals.map(r => 
      r.id === id ? { ...r, isSettled: true, updatedAt: new Date().toISOString() } : r
    ));
  };

  const addPayment = (rentalId: string, payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setRentals(rentals.map(r => 
      r.id === rentalId 
        ? { ...r, payments: [...r.payments, newPayment], updatedAt: new Date().toISOString() } 
        : r
    ));
  };

  const updatePayment = (rentalId: string, paymentId: string, paymentUpdates: Partial<Payment>) => {
    setRentals(rentals.map(r => 
      r.id === rentalId 
        ? { 
            ...r, 
            payments: r.payments.map(p => 
              p.id === paymentId ? { ...p, ...paymentUpdates } : p
            ),
            updatedAt: new Date().toISOString() 
          } 
        : r
    ));
  };

  const deletePayment = (rentalId: string, paymentId: string) => {
    setRentals(rentals.map(r => 
      r.id === rentalId 
        ? { ...r, payments: r.payments.filter(p => p.id !== paymentId), updatedAt: new Date().toISOString() } 
        : r
    ));
  };

  const updateReminderSettings = (updates: Partial<ReminderSettings>) => {
    setReminderSettings({ ...reminderSettings, ...updates });
  };

  return (
    <RentalContext.Provider value={{
      rentals,
      reminderSettings,
      addRental,
      updateRental,
      deleteRental,
      settleRental,
      addPayment,
      updatePayment,
      deletePayment,
      updateReminderSettings
    }}>
      {children}
    </RentalContext.Provider>
  );
};

export const useRental = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within RentalProvider');
  }
  return context;
};

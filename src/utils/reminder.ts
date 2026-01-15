import dayjs from 'dayjs';
import { Rental, ReminderSettings } from '../types';
import { storage } from './storage';
import { checkDailyPaymentComplete, checkMonthlyPaymentComplete } from './calculator';

let reminderInterval: ReturnType<typeof setInterval> | null = null;

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

export const showNotification = (title: string, body: string): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
};

export const checkReminders = (rentals: Rental[], settings: ReminderSettings): void => {
  if (!settings.enabled) return;
  
  const now = dayjs();
  const currentTime = now.format('HH:mm');
  const currentDay = now.date();
  const today = now.format('YYYY-MM-DD');
  
  rentals.forEach(rental => {
    if (rental.isSettled || rental.endDate) return;
    
    if (settings.dailyReminder && currentTime === settings.dailyTime) {
      const daysRented = now.diff(dayjs(rental.startDate), 'day') + 1;
      
      if (rental.rentalType === 'daily') {
        const isDailyComplete = checkDailyPaymentComplete(rental, today);
        if (!isDailyComplete) {
          showNotification(
            `还款提醒 - ${rental.tenantName}`,
            `${rental.itemName} ${rental.quantity}${rental.itemName.includes('片') ? '片' : '个'}，已租${daysRented}天，请完成当日还款`
          );
        }
      } else {
        showNotification(
          `租赁提醒 - ${rental.tenantName}`,
          `${rental.itemName} ${rental.quantity}${rental.itemName.includes('片') ? '片' : '个'}，已租${daysRented}天`
        );
      }
    }
    
    if (settings.monthlyReminder && currentDay === settings.monthlyDay) {
      if (rental.rentalType === 'monthly') {
        const isMonthlyComplete = checkMonthlyPaymentComplete(rental, today);
        if (!isMonthlyComplete) {
          showNotification(
            `月度还款提醒 - ${rental.tenantName}`,
            `${rental.itemName} ${rental.quantity}${rental.itemName.includes('片') ? '片' : '个'}，请完成当月还款`
          );
        }
      } else {
        showNotification(
          `月度账单提醒 - ${rental.tenantName}`,
          `${rental.itemName} ${rental.quantity}${rental.itemName.includes('片') ? '片' : '个'}，请及时结算租金`
        );
      }
    }
  });
};

export const startReminderService = (rentals: Rental[]): void => {
  const settings = storage.getReminderSettings();
  
  if (reminderInterval) {
    clearInterval(reminderInterval);
  }
  
  reminderInterval = setInterval(() => {
    checkReminders(rentals, settings);
  }, 60000);
};

export const stopReminderService = (): void => {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    reminderInterval = null;
  }
};

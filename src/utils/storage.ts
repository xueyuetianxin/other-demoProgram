const STORAGE_KEY = 'rental_data';
const REMINDER_KEY = 'reminder_settings';

export const storage = {
  getRentals: (): any[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveRentals: (rentals: any[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rentals));
  },

  getReminderSettings: (): any => {
    try {
      const data = localStorage.getItem(REMINDER_KEY);
      return data ? JSON.parse(data) : {
        enabled: true,
        dailyReminder: true,
        dailyTime: '09:00',
        monthlyReminder: true,
        monthlyDay: 1
      };
    } catch {
      return {
        enabled: true,
        dailyReminder: true,
        dailyTime: '09:00',
        monthlyReminder: true,
        monthlyDay: 1
      };
    }
  },

  saveReminderSettings: (settings: any): void => {
    localStorage.setItem(REMINDER_KEY, JSON.stringify(settings));
  }
};

/**
 * Get a date key in format YYYY-M-D
 * @param {Date|string} date - The date to convert
 * @returns {string} Date key
 */
export const getDateKey = (date = new Date()) => {
  try {
    const d = date instanceof Date ? date : new Date(date);
    
    // Validate the date
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date provided');
    }
    
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  } catch (error) {
    console.error('Error generating date key:', error);
    // Fallback to current date
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }
};

/**
 * Check if a day is today
 * @param {number} day - The day number
 * @param {Date} selectedDate - The selected date
 * @returns {boolean} True if the day is today
 */
export const isToday = (day, selectedDate = new Date()) => {
  const today = new Date();
  return (
    day === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Get greeting based on current time
 * @returns {string} Greeting message
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
};

/**
 * Generate calendar days for a given month
 * @param {Date} selectedDate - The selected date
 * @returns {Array} Array of calendar days
 */
export const generateCalendarDays = (selectedDate) => {
  try {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = Array(firstDayOfMonth).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  } catch (error) {
    console.error('Error generating calendar days:', error);
    return [];
  }
};

/**
 * Format date for display
 * @param {Date|string} date - The date to format
 * @param {string} format - Format type ('short', 'long', 'time')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  try {
    const d = date instanceof Date ? date : new Date(date);
    
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date provided');
    }
    
    switch (format) {
      case 'short':
        return d.toLocaleDateString();
      case 'long':
        return d.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'time':
        return d.toLocaleTimeString();
      default:
        return d.toLocaleDateString();
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Check if two dates are the same day
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} True if same day
 */
export const isSameDay = (date1, date2) => {
  try {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);
    
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  } catch (error) {
    console.error('Error comparing dates:', error);
    return false;
  }
};

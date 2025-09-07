/**
 * Error handling utilities
 */

/**
 * Logs error with context information
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @param {Object} additionalInfo - Additional information to log
 */
export const logError = (error, context = 'Unknown', additionalInfo = {}) => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    stack: error.stack,
    ...additionalInfo,
  });
};

/**
 * Creates a user-friendly error message
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default message if error message is not user-friendly
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error, defaultMessage = 'Something went wrong') => {
  if (!error || !error.message) {
    return defaultMessage;
  }

  // Check for common error patterns and provide user-friendly messages
  if (error.message.includes('Network')) {
    return 'Please check your internet connection and try again.';
  }
  
  if (error.message.includes('Storage')) {
    return 'Unable to save data. Please try again.';
  }
  
  if (error.message.includes('Permission')) {
    return 'Permission denied. Please check your app permissions.';
  }

  // Return the original message if it seems user-friendly
  if (error.message.length < 100 && !error.message.includes('Error:')) {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} Promise that resolves with the function result
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries) {
        throw error;
      }
      
      // Exponential backoff: delay * 2^i
      const currentDelay = delay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }
  
  throw lastError;
};

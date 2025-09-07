/**
 * Error handling utilities
 */

/**
 * Logs error with context information
 */
export const logError = (error: Error, context: string = 'Unknown', additionalInfo: Record<string, any> = {}): void => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    stack: error.stack,
    ...additionalInfo,
  });
};

/**
 * Creates a user-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: Error, defaultMessage: string = 'Something went wrong'): string => {
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
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3, 
  delay: number = 1000
): Promise<T> => {
  let lastError: Error = new Error('Unknown error');
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
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

import { toast } from 'react-toastify';

// Toast configuration
export const toastConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

// Success toast
export const showSuccess = (message) => {
  toast.success(message, toastConfig);
};

// Error toast
export const showError = (message) => {
  toast.error(message, toastConfig);
};

// Info toast
export const showInfo = (message) => {
  toast.info(message, toastConfig);
};

// Warning toast
export const showWarning = (message) => {
  toast.warning(message, toastConfig);
};

// Handle API errors with detailed messages
export const handleApiError = (error, defaultMessage = "An error occurred") => {
  let message = defaultMessage;
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  showError(message);
};

// Handle API success with custom messages
export const handleApiSuccess = (message = "Operation completed successfully") => {
  showSuccess(message);
}; 
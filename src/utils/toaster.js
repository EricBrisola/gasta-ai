import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toaster = () => {
  const sucessToast = (successMessage) => {
    toast.success(successMessage, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
      style: {
        width: '320px'
      }
    });
  };

  const errorToast = (errorMessage) => {
    toast.error(errorMessage, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
      style: {
        width: '320px'
      }
    });
  };
  return { sucessToast, errorToast };
};

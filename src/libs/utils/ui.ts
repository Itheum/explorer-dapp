import toast from 'react-hot-toast';

/*
    UI should import Toaster
    /////////////////////////////////////////////
    import { Toaster } from 'react-hot-toast';
    <Toaster />
    /////////////////////////////////////////////
*/

export const toastError = (message: string) => {
  toast.error(
    message,
    {
      position: 'top-right',
    }
  );
};

export const toastSuccess = (message: string) => {
  toast.success(
    message,
    {
      position: 'top-right',
    }
  );
};

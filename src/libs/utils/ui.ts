import { clsx, ClassValue } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

/*
    UI should import Toaster
    /////////////////////////////////////////////
    import { Toaster } from 'react-hot-toast';
    <Toaster />
    /////////////////////////////////////////////
*/

export const toastError = (message: string) => {
  toast.error(message, {
    position: "top-right",
  });
};

export const toastSuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
  });
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);

  if (section) {
    window.scrollTo({
      top: section.offsetTop,
      behavior: "smooth",
    });
  }
};

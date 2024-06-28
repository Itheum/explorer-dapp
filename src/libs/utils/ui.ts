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

export function timeUntil(lockPeriod: number): { count: number; unit: string } {
  const seconds = lockPeriod;

  const intervals = [
    { seconds: 3153600000, unit: "century" },
    { seconds: 31536000, unit: "year" },
    { seconds: 2592000, unit: "month" },
    { seconds: 86400, unit: "day" },
    { seconds: 3600, unit: "hour" },
    { seconds: 60, unit: "minute" },
    { seconds: 1, unit: "second" },
  ];
  const interval = intervals.find((i) => i.seconds <= seconds) ?? intervals[0];

  const count = Math.floor(seconds / interval!.seconds);
  const unit = count === 1 ? interval!.unit : interval!.unit + "s";

  return { count, unit };
}

export function timeSince(unixTimestamp: number): string {
  const seconds = Math.floor((new Date().getTime() - unixTimestamp * 1000) / 1000);

  const intervals = [
    { seconds: 3153600000, unit: "century" },
    { seconds: 31536000, unit: "year" },
    { seconds: 2592000, unit: "month" },
    { seconds: 86400, unit: "day" },
    { seconds: 3600, unit: "hour" },
    { seconds: 60, unit: "minute" },
    { seconds: 1, unit: "second" },
  ];
  const interval = intervals.find((i) => i.seconds <= seconds) ?? intervals[0];

  const count = Math.floor(seconds / interval!.seconds);
  const unit = count === 1 ? interval!.unit : interval!.unit + "s";

  return `${count} ${unit}`;
}

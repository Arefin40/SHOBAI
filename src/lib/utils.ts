import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const imageFileToPreview = (file?: File) => {
   return new Promise<string | null>((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
   });
};

export const imageFilesToPreviews = (files: File[]) => {
   return Promise.all(files.map(imageFileToPreview)).then(
      (result) => result.filter(Boolean) as string[]
   );
};

export const formatPostTime = (timestamp: number) => {
   const now = Date.now();
   const diff = now - timestamp; // difference in ms

   const seconds = Math.floor(diff / 1000);
   const minutes = Math.floor(seconds / 60);
   const hours = Math.floor(minutes / 60);
   const days = Math.floor(hours / 24);

   if (seconds < 60) return "just now";
   if (minutes < 60) return `${minutes}m ago`;
   if (hours < 24) return `${hours}h ago`;
   if (days < 7) return `${days}d ago`;

   const date = new Date(timestamp);
   const dateOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
   const currentYear = new Date().getFullYear();

   if (date.getFullYear() !== currentYear) {
      dateOptions.year = "numeric";
   }

   return date.toLocaleDateString("en-BD", dateOptions);
};

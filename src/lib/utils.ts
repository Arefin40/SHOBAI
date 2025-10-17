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

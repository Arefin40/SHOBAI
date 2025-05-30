import { cn } from "@/lib/utils";
import React from "react";

type HeartIconProps = {
   isLiked?: boolean;
   filledColor?: string;
   className?: string;
};

function Heart({ isLiked = false, filledColor = "text-[#F52C4B]", className }: HeartIconProps) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         className={cn(
            "size-5 fill-current",
            isLiked ? filledColor : "text-muted-foreground",
            className
         )}
      >
         {isLiked ? (
            <path d="M6.469 1.838C2.697 1.838 0 4.996 0 8.785c0 4.333 3.55 8.416 11.514 13.24a.94.94 0 0 0 .973 0C20.45 17.201 24 13.118 24 8.785c0-3.787-2.696-6.947-6.47-6.947-1.996 0-3.745.89-5.06 2.574a8.516 8.516 0 0 0-.47.668 8.514 8.514 0 0 0-.471-.668c-1.315-1.684-3.064-2.574-5.06-2.574z" />
         ) : (
            <path d="M17.531 1.839c-1.996 0-3.747.89-5.061 2.574a8.52 8.52 0 0 0-.47.667 8.51 8.51 0 0 0-.47-.667c-1.315-1.684-3.065-2.575-5.061-2.575-3.772 0-6.47 3.158-6.47 6.948 0 4.332 3.552 8.416 11.515 13.24a.937.937 0 0 0 .971 0C20.448 17.202 24 13.118 24 8.786c0-3.788-2.695-6.947-6.468-6.947zm2.117 12.341c-1.658 1.85-4.163 3.798-7.648 5.945-3.485-2.147-5.99-4.095-7.648-5.945-1.667-1.86-2.477-3.624-2.477-5.395 0-2.728 1.844-5.072 4.594-5.072 1.4 0 2.594.61 3.549 1.81.763.96 1.085 1.952 1.087 1.96a.938.938 0 0 0 1.79 0c.003-.01.315-.971 1.053-1.917.96-1.23 2.165-1.853 3.583-1.853 2.753 0 4.594 2.346 4.594 5.072 0 1.77-.81 3.536-2.477 5.395z" />
         )}
      </svg>
   );
}

export default Heart;

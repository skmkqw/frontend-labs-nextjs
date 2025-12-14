import { twMerge as twMergeOrignial } from "tailwind-merge";
import clsx from "clsx";

export default function cn(...args: any) {
    return twMergeOrignial(clsx(args));
} 
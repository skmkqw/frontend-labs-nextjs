import { ButtonHTMLAttributes } from "react";
import cn from "../lib/utils";

const sizes = {
    lg: "h-12 px-6 m-2 text-lg text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed",
    default: "h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed",
    sm: "h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed",
};

type ButtonProps = {
    variant?: "default" | "sm" | "lg" | "link";
    href?: string;
    className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    children,
    className,
    variant = "default",
    href = "/",
    type = "button",
    ...rest
}: ButtonProps) {
    if (variant === "link") {
        return (
            <a
                className={cn(
                    "inline-flex items-center h-8 px-4 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800",
                    className,
                )}
                href={href}
            >
                {children}
            </a>
        );
    }

    return (
        <button type={type} className={cn(sizes[variant], className)} {...rest}>
            {children}
        </button>
    );
}

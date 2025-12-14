import cn from "../lib/utils";

const sizes = {
    "lg": "h-12 px-6 m-2 text-lg text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800",
    "default": "h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800",
    "sm": "h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800",
}

export default function Button({ children, className, variant = "default", href = "/" }: { children: React.ReactNode, className?: string, variant: "default" | "sm" | "lg" | "link", href: string }) {
    if (variant === "link") {
        return (
            <a
                className={cn("inline-flex items-center h-8 px-4 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800", className)}
                href={href}
            >
                {children}
            </a>
        );
    }

    return (
        <button className={cn(sizes[variant], className)}>
            {children}
        </button>
    );
}
import { useCallback, useEffect, useState } from "react";

export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return systemDark ? "dark" : "light";
    });



    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme(theme === "dark" ? "light" : "dark");

    return { theme, toggleTheme };
}
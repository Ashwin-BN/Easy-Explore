import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false); // Default value

  // 🔁 Load saved dark mode value from localStorage (only in browser)
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      setDarkMode(stored === "true");
    }
  }, []);

  // 🌙 Toggle dark mode and update body class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }

    // 💾 Save the current mode to localStorage
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // 🌍 Provide the context to all children
  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme: () => setDarkMode(prev => !prev) }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 🔗 Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

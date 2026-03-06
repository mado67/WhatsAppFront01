import { createContext, useContext, useState } from "react";

const StackNavigationContext = createContext();

export const StackNavigationProvider = ({ children }) => {
  const [history, setHistory] = useState(['ChatList']);
  const [currentIndex, setCurrentIndex] = useState(0);

  const push = (component) => {
    setHistory((prev) => {
      const updated = prev.slice(0, currentIndex + 1);
      updated.push(component);
      return updated;
    });
    setCurrentIndex((prev) => prev + 1);
  };

  const back = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const next = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const replace = (component) => {
    setHistory((prev) => {
      const updated = [...prev];
      updated[currentIndex] = component;
      return updated;
    });
  };

  return (
    <StackNavigationContext.Provider
      value={{
        current: history[currentIndex],
        push,
        back,
        next,
        replace,
        canGoBack: currentIndex > 0,
        canGoNext: currentIndex < history.length - 1,
      }}
    >
      {children}
    </StackNavigationContext.Provider>
  );
};

export const useStackNavigation = () => useContext(StackNavigationContext);
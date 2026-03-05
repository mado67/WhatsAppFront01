import { createContext, useContext, useState } from "react";

const StackNavigationContext = createContext();

export const StackNavigationProvider = ({ initialComponent, children }) => {
  const [stack, setStack] = useState([initialComponent]);

  const push = (component) => {
    setStack((prev) => [...prev, component]);
  };

  const pop = () => {
    setStack((prev) => {
      if (prev.length === 1) return prev;
      return prev.slice(0, -1);
    });
  };

  const replace = (component) => {
    setStack((prev) => {
      const newStack = [...prev];
      newStack[newStack.length - 1] = component;
      return newStack;
    });
  };

  return (
    <StackNavigationContext.Provider
      value={{
        current: stack[stack.length - 1],
        push,
        pop,
        replace,
        canGoBack: stack.length > 1,
      }}
    >
      {children}
    </StackNavigationContext.Provider>
  );
};

export const useStackNavigation = () => useContext(StackNavigationContext);
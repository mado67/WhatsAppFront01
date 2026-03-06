import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null)


    const token = useMemo(
        () => localStorage.getItem("token"),
        []
    );

    return (
        <AuthContext.Provider value={{ user, token, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
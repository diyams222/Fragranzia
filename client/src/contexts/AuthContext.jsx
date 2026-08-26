import { createContext, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});

    const accessToken = sessionStorage.getItem("accessToken");
    // const username = sessionStorage.getItem("username");
    const image = sessionStorage.getItem("profileImage");
    const name = sessionStorage.getItem("name")
    const role = sessionStorage.getItem("role");
    const id = sessionStorage.getItem("userId");

    if (accessToken && role && !auth.accessToken) {
        setAuth({ accessToken, role, image, name, id });
    };
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )

}
import { createContext, useState } from "react";

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false,
  );

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{
      auth, setAuth, persist, setPersist,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

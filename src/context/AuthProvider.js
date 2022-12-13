import { createContext, useState } from "react";

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});
  const [selectedGroup, setSelectedGroup] = useState();
  const [groups, setGroups] = useState();
  const [present, setPresent] = useState({});
  const [selectedSlide, setSelectedSlide] = useState();
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  return (
    <AuthContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
        selectedGroup,
        setSelectedGroup,
        groups,
        setGroups,
        present,
        setPresent,
        selectedSlide,
        setSelectedSlide,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

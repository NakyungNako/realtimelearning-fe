import axios from "../api/axios";
import useAuth from "./useAuth";

export default function useLogout() {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      await axios("/api/users/logout", {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
}

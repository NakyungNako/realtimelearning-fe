import axios from "../api/axios";
import useAuth from "./useAuth";

export default function useLogout() {
  const { setAuth, setSelectedGroup } = useAuth();

  const logout = async () => {
    setAuth({});
    setSelectedGroup();
    try {
      await axios.get("/api/users/logout", {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
}

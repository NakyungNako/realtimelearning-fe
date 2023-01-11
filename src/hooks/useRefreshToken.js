import axios from "../api/axios";
import useAuth from "./useAuth";

export default function useRefreshToken() {
  const { setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.get("/api/users/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      // console.log(JSON.stringify(prev));
      // console.log(response.data);
      return {
        ...prev,
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        accessToken: response.data.token,
      };
    });
    return response.data.token;
  };
  return refresh;
}

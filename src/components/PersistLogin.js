import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    !auth.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    // eslint-disable-next-line no-return-assign
    return () => (isMounted = false);
  }, []);
  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`aT: ${JSON.stringify(auth.accessToken)}`);
  }, [isLoading]);

  // eslint-disable-next-line no-nested-ternary
  return !persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />;
}

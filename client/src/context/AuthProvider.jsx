import { createContext, useEffect, useState } from "react";
import AxiosInstance from "@/constants/api";
import { useLocation } from "react-router-dom";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const ignorePath = ["/login", "/signup"];

    const fetchUser = async () => {

      if (!ignorePath.includes(location.pathname)) {
        try {

          const token = localStorage.getItem("jwtToken");

          if (!token) {
            setUser(null);
            setIsLogged(false);
            setLoading(false);
            return;
          }
          const res = await AxiosInstance.get("/api/current-user");

          const user = {
            firstname: res.data.first_name,
            lastname: res.data.last_name,
            username: res.data.username,
            email: res.data.email,
            loggedIn: res.data.logged_in,
          };

          // console.log(user)

          if (user) {
            setUser(user);
            setIsLogged(user.loggedIn);
          } else {
            setUser(null);
            setIsLogged(false);
          }

        } catch (err) {
          console.log(err);
          setUser(null);
          setIsLogged(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchUser();
  }, [location.pathname]);

  const logout = async () => {
    // set the user's logged in status as false in backend
    try {
      const res = await AxiosInstance.post("/api/logout");

      if(res) {
        setUser(null);
        setIsLogged(false);
        localStorage.removeItem("jwtToken");
      }
      console.log(res.response.data);
    }
    catch (err) {
      console.log(user);
      console.log(err.response);
    }
  }

  return (
    <AuthContext.Provider
      value={{ isLogged, user, setUser, loading, setIsLogged, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider };
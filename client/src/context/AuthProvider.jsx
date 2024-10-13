import { createContext, useEffect, useState } from "react";
import AxiosInstance from "@/constants/api";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const nav = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {

        try {
          const res = await AxiosInstance.get("/api/current-user");

          const user = {
            username: res.data.username,
            email: res.data.email,
            loggedIn: res.data.logged_in,
          };

          console.log(user)

          if (user) {
            setUser(user);
            setIsLogged(user.loggedIn);
          } else {
            setUser(null);
            setIsLogged(false);
          }

        } catch (err) {
          console.log(err.response);
          setUser(null);
          setIsLogged(false);
        } finally {
          setLoading(false);
        }
    }

    fetchUser();
  }, []);

  const logout = async () => {
    // set the user's logged in status as false in backend
    try {
      const res = await AxiosInstance.post("/api/logout");

      if(res) {
        setUser(null);
        setIsLogged(false);
       nav("/login");
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
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
    const fetchUser = async () => {
      try {
        const res = await AxiosInstance.get("/api/current-user");

        const user = {
          firstname: res.data.first_name,
          lastname: res.data.last_name,
          username: res.data.username,
          email: res.data.email,
          loggedIn: res.data.logged_in,
        };

        if (user && user.loggedIn) {
          setUser(user);
          setIsLogged(true);
        } else {
          setUser(null);
          setIsLogged(false);
        }

      }
      catch (err) {
        console.log(err);
        setUser(null);
        setIsLogged(false);
      }
      finally {
        setLoading(false);
      };
    }
    fetchUser();
  }, []);
  
  return (
    <AuthContext.Provider
      value={{ isLogged, user, setUser, loading, setIsLogged }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider };
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';

import FormField from '@/components/FormField'
import AxiosInstance from '@/constants/api';
import images from '@/constants/images';
import icons from '@/constants/icons';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthProvider';


function Login() {
  const { setUser, setIsLogged, user, isLogged, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [load, setLoad] = useState(true);
  const [error, setError] = useState({
    username: "",
    password: "",
    empty: "",
  });

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleImageLoad = () => {
    setLoad(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    AxiosInstance.post("/api/login", form)
      .then(res => {
        console.log(res);
        setForm({
          username: "",
          password: "",
        });
        setError({
          username: "",
          password: "",
          empty: ""
        });
        localStorage.setItem("jwtToken", res.data.token);

        setUser(form);
        setIsLogged(true);

        navigate("/home");
      })
      .catch(err => {
        console.error(err.response.data);
        const serverErrors = err.response.data;
        const newErrors = { ...error };

        Object.keys(serverErrors).forEach((key) => {
          if (newErrors.hasOwnProperty(key)) {
            newErrors[key] = serverErrors[key];
          }
        });

        setError(newErrors);
      })
  };
  
  // TODO: fix this
  useEffect(() => {
    console.log(user, isLogged, loading)
    if(user && isLogged && !loading) {
      navigate("/home");
    }
  }, [user, isLogged, loading,  navigate])

  return (
    <>
      <div className="flex items-center justify-center text-center flex-wrap md:flex-nowrap">
        <div className="hidden md:block w-1/2 p-4">
          {load && (
            <span className="w-24 h-24 loading loading-spinner text-warning"></span>
          )}
          <img onLoad={handleImageLoad} src={images.basketball} alt="basketball" className="w-full object-cover rounded-xl h-[845px] m-4" />
        </div>

        <div className="w-full md:w-1/2 p-4">

          <h1 className="font-black text-3xl text-center m-4 text-warning">login to moist sports</h1>

          <form onSubmit={handleSubmit}>
            <FormField
              title="Username"
              placeholder="enter username"
              value={form.username}
              handleTextChange={(e) => setForm({ ...form, username: e.target.value })}
              errorMessage={error.username}
            />
            <FormField
              title="Password"
              placeholder="enter password"
              value={form.password}
              type="password"
              handleTextChange={(e) => setForm({ ...form, password: e.target.value })}
              errorMessage={error.password}
            />

            {error.empty && (
              <div className="flex items-center justify-center">
                <div role="alert" className="alert alert-warning m-6 max-w-lg">
                  <img className="h-6 w-6 shrink-0 stroke-current" src={icons.warning} alt="warning sign" />
                  <span className="text-sm font-black">{error.empty}</span>
                </div>
              </div>
            )}

            <button
              className="w-full max-w-lg text-lg btn mt-4 btn-secondary items-center font-black"
              type="submit"
            >
              login
              <img
                src={icons.rightArrow}
                className="h-7 w-7"
              />
            </button>

        
          </form>
          
          <div className="mt-4">
            <p>don't have an account? <a className="text-blue-500" href="/signup">sign up here</a></p>
          </div>


        </div>
      </div>


    </>
  )
}

export default Login
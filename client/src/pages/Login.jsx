import React, { useEffect, useState } from 'react';
import { useContext } from 'react';

import FormField from '@/components/FormField'
import AxiosInstance from '@/constants/api';
import images from '@/constants/images';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthProvider';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';


function Login() {
  const { setUser, setIsLogged, user, isLogged, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [imageLoad, setImageLoad] = useState(true);
  const [error, setError] = useState({
    username: "",
    password: "",
    empty: "",
  });

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    setLoadingLogin(true);
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
      .finally(() => {
        setLoadingLogin(false);
      })
  };
  
  return (
    <>
      <div className="flex items-center justify-center text-center flex-wrap md:flex-nowrap">
        <div className="hidden md:block w-1/2 p-4">
          <div className={`w-full h-[845px] m-4 bg-black rounded-xl ${imageLoad ? 'block' : 'hidden'}`}></div>
            <img
              src={images.basketball}
              alt="surfing"
              className={`w-full object-cover rounded-xl h-[845px] m-4 transition-opacity duration-500 ease-in-out ${imageLoad ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setImageLoad(false)}
              onError={() => setImageLoad(false)} 
            />
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
                  <WarningAmberRoundedIcon sx={{ fontSize: '1.85rem' }} />
                  <span className="text-sm font-black">{error.empty}</span>
                </div>
              </div>
            )}

            <button
              className="w-full max-w-lg text-lg btn mt-4 btn-secondary items-center font-black"
              type="submit"
            >
              {loadingLogin ? (
                <span className="w-7 h-7 loading loading-spinner text-warning"></span>
              ) : (
                <>login <ArrowForwardRoundedIcon sx={{ fontSize: '1.85rem' }}  /> </>
              )}
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
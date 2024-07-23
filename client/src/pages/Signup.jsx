import React, { useState } from 'react';
import { useContext } from 'react';

import FormField from '@/components/FormField'
import AxiosInstance from '@/constants/api';
import images from '@/constants/images';
import icons from '@/constants/icons';
import { AuthContext } from '@/context/AuthProvider';


function Signup() {
  const { user, isLogged } = useContext(AuthContext);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    email: "",
    empty: "",
  });

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleImageLoad = () => {
    setLoad(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    AxiosInstance.post("/api/signup", form)
      .then(res => {
        console.log(res);
        setForm({
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          password: "",
        });
        setError({
          username: "",
          firstname: "",
          lastname: "",
          password: "",
          email: "",
          empty: ""
        });
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
    if (user && isLogged) {
      navigate("/home");
    }
  }, [user, isLogged, navigate])

  return (
    <>
      <div className="flex items-center justify-center text-center flex-wrap md:flex-nowrap">
        <div className="hidden md:block w-1/2 p-4">
          {load && (
            <span className="w-24 h-24 loading loading-spinner text-warning"></span>
          )}
          <img onLoad={handleImageLoad} src={images.surfing} alt="surfing" className="w-full object-cover rounded-xl h-[845px] m-4" />
        </div>


        <div className="w-full md:w-1/2 p-4">

          <h1 className="font-black text-3xl text-center m-4 text-warning">signup to moist sports</h1>

          <form onSubmit={handleSubmit}>
            <FormField
              title="First Name"
              placeholder="enter first name"
              value={form.first_name}
              handleTextChange={(e) => setForm({ ...form, first_name: e.target.value })}
              errorMessage={error.firstname}
            />
            <FormField
              title="Last Name"
              placeholder="enter last name"
              value={form.last_name}
              handleTextChange={(e) => setForm({ ...form, last_name: e.target.value })}
              errorMessage={error.lastname}
            />
            <FormField
              title="Email"
              placeholder="enter email"
              value={form.email}
              type="email"
              handleTextChange={(e) => setForm({ ...form, email: e.target.value })}
              errorMessage={error.email}
            />
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
              signup
              <img
                src={icons.rightArrow}
                className="h-7 w-7"
              />
            </button>

          </form>

          <div className="mt-4">
            <p>already have an account? <a className="text-blue-500" href="/login">login here</a></p>
          </div>
        </div>
      </div>

    </>
  )
}

export default Signup

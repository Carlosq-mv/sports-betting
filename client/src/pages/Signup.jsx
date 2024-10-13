import React, { useState, useEffect } from 'react';
import { useContext } from 'react';

import FormField from '@/components/FormField'
import AxiosInstance from '@/constants/api';
import images from '@/constants/images';
import { AuthContext } from '@/context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user, isLogged } = useContext(AuthContext);
  const [imageLoad, setImageLoad] = useState(true);
  const [modal, showModal] = useState(false);

  const [error, setError] = useState({
    username: "",
    password: "",
    email: "",
    empty: "",
    account_err: "",
  });

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });


  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    AxiosInstance.post("/api/signup", form)
      .then(res => {
        console.log(res);
        setForm({
          username: "",
          email: "",
          password: "",
        });
        setError({
          username: "",
          password: "",
          email: "",
          empty: "",
         account_err: "",
        });
        showModal(true);
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
        setLoading(false);
      })
  };

  return (
    <>
      <div className="flex items-center justify-center text-center flex-wrap md:flex-nowrap">
        <div className="hidden md:block w-1/2 p-4">
          <div className={`w-full h-[845px] m-4 bg-black rounded-xl ${imageLoad ? 'block' : 'hidden'}`}></div>
            <img
              src={images.surfing}
              alt="surfing"
              className={`w-full object-cover rounded-xl h-[845px] m-4 transition-opacity duration-500 ease-in-out ${imageLoad ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setImageLoad(false)}
              onError={() => setImageLoad(false)} 
            />
          </div>

        <div className="w-full md:w-1/2 p-4">

          <h1 className="font-black text-3xl text-center m-4 text-warning">signup to banter</h1>

          <form onSubmit={handleSubmit}>
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

            {(error.empty || error.account_err) && (
              <div className="flex items-center justify-center">
                <div role="alert" className="alert alert-warning m-4 max-w-lg">
                  <WarningAmberRoundedIcon sx={{ fontSize: '1.85rem' }} />
                  <span className="text-sm font-black">{error.empty ? error.empty : error.account_err }</span>
                </div>
              </div>
            )}

            <button
              className="w-full max-w-lg text-lg btn mt-4 btn-secondary items-center font-black"
              type="submit"
            >
              {loading ? (
                <span className="w-7 h-7 loading loading-spinner text-warning"></span>
              ) : (
                <>signup <ArrowForwardRoundedIcon sx={{ fontSize: '1.85rem' }}  /> </>
              )}
            </button>

          </form>

          {/* Open the modal using document.getElementById('ID').showModal() method */}
          {modal && (
            <dialog id="modal" className="modal modal-bottom sm:modal-middle" open>
              <div className="modal-box rounded-lg shadow-lg">
                <h3 className="font-bold text-lg text-warning mb-4">Welcome to Ace's High Casino!</h3>
                <p className="py-4 text-gray-500">
                  Congratulations! You’ve successfully joined our casino family.
                  Thank you for choosing Ace's High Casino. We’re thrilled to have you on board and wish you the best of luck!
                  <br /><br />
                  Happy Gaming!
                </p>
                <div className="modal-action">
                  <form method="dialog">
                    <button onClick={() => showModal(false)} className="btn btn-secondary">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          )}

          <div className="mt-4">
            <p>already have an account? <a className="text-blue-500" href="/login">login here</a></p>
          </div>
        </div>
      </div>

    </>
  )
}

export default Signup

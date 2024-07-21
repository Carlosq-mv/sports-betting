import React, { useState } from 'react'
import icons from '@/constants/icons';

function FormField({ title, type, value, otherStyles, placeholder, handleTextChange, errorMessage, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="flex justify-center items-center m-4">
        <div className="form-control w-full max-w-lg">
          <div className="label mb-2">
            <span className="label-text">{title}</span>
          </div>

          <div className="input input-bordered flex items-center gap-2 w-full">
            <input
              type={type === "password" && showPassword ? "text" : type ? type : "text"}
              placeholder={placeholder}
              value={value}
              onChange={handleTextChange}
              className="grow text-sm"
            />
            {type === "password" && (
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                <img
                  src={showPassword ? icons.eyeCrossed : icons.eye}
                  className="w-7 h-7"
                  alt={showPassword ? "Hide password" : "Show password"}
                />
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="label">
              <span className="label-text-alt text-sm text-error">{errorMessage}</span>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default FormField
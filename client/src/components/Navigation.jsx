import React, { useContext } from 'react'
import { AuthContext } from '@/context/AuthProvider'

function Navigation({ currentUser, handleLogout }) {

  return (
    <div className="navbar bg-base-100">

      <div className="flex-1">
        <a className="btn btn-ghost text-xl text-warning">moist sports</a>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><a>Link</a></li>
          <li>
            <details>
              <summary>{currentUser.username}</summary>
              <ul className="bg-base-100 rounded-t-none p-2">
                <li><a>Settings</a></li>
                <li><a onClick={handleLogout}>Logout</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navigation
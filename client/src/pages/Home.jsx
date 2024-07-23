import React, { useContext } from 'react'
import Navigation from '@/components/Navigation'

import { AuthContext } from '@/context/AuthProvider'
import { Navigate } from 'react-router-dom';

function Home() {
  const { logout, user, loading, isLogged } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[800px]">
        <span className="w-24 h-24 loading loading-spinner text-warning"></span>
      </div>
    )
  }

  if(!user && !isLogged) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Navigation
        currentUser={user}
        handleLogout={logout}
      />
      <p>This is the home page</p>
    </>
  )
}

export default Home
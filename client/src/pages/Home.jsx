import React, { useContext } from 'react';
import Navigation from '@/components/Navigation';
import { AuthContext } from '@/context/AuthProvider';
import { Navigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function Home() {
  const { logout, user, loading, isLogged } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="w-24 h-24 loading loading-spinner text-warning"></span>
      </div>
    );
  }

  if (!user && !isLogged) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <div className="p-4">
            <h1 className="text-2xl text-warning font-bold">Welcome to Moist Chats!</h1>
            <p className="mt-2">Your chat history and messages will appear here.</p>
          </div>
          <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-300 text-base-content min-h-full w-64 flex flex-col items-center p-4 space-y-4"> {/* Adjusted width to w-64 */}
            <h2 className="text-xl font-bold mb-4 text-warning hover:text-[#1DA1F2] pt-4">Moist Chats</h2> {/* Title added */}

            <hr className="border-t border-gray-300 w-full mb-4" />
            <li className="w-full text-center"><a className="hover:text-warning transition"><ChatIcon /> Chats</a></li>
            <li className="w-full text-center"><a className="hover:text-warning transition"><GroupIcon /> Friends</a></li>
            <li className="w-full text-center"><a className="hover:text-warning transition"><NotificationsIcon />Notifications</a></li>
            <li className="w-full text-center"><a className="hover:text-warning transition"><AccountCircleIcon />Profile</a></li>
            <li className="w-full text-center"><a className="hover:text-warning transition"><HelpOutlineIcon />Help</a></li>
            <li className="w-full text-center"><a className="hover:text-warning transition"><SettingsIcon />Settings</a></li>
            <li className="w-full text-center"><a onClick={logout} className="hover:text-warning transition"><LogoutIcon />Logout</a></li>

            
          </ul>
        </div>
      </div>
    </>
  );
}

export default Home;

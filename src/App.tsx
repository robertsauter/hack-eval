import { Button } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { store } from './lib/Store.ts';
import { setUserLoggedOut } from './lib/auth.ts';

export default function App() {
  const navigate = useNavigate();

  const logout = () => {
    setUserLoggedOut();
    navigate('/login');
  };

  useEffect(() => {
    const accessToken: string | null = window.localStorage.getItem('access_token');
    if(accessToken) {
      store.loggedIn = true;
    }
  }, []);

  return (
    <>
      {
        store.loggedIn 
          ? <Button className="absolute top-5 right-5" variant="outlined" onClick={logout}>Logout</Button>
          : <></>
      }
      <Outlet />
    </>
  );
}
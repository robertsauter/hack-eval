import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { userService } from './services/UserService';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken: string | null = window.localStorage.getItem('access_token');
    if(accessToken) {
      userService.handleLoginSuccess(JSON.parse(accessToken));
    }

    const loggedInSubscription = userService.loggedIn$.subscribe((logged) => {
      setLoggedIn(logged);
      if(!logged) {
        navigate('/login');
      }
    });

    return () => {
      loggedInSubscription.unsubscribe();
    }
  }, []);

  return (
    <>
      {
        loggedIn 
          ? <Button className="absolute top-5 right-5" variant="outlined" onClick={userService.logout}>Logout</Button>
          : <></>
      }
      <Outlet />
    </>
  );
}
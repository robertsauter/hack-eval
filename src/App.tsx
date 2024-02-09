import { Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { userService } from './services/UserService';
import { googleFormsService } from './services/GoogleFormsService';
import { State } from './lib/AsyncState';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [appState, setAppState] = useState<State>('loading');

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
      setAppState('success');
    });

    googleFormsService.initialize();

    return () => {
      loggedInSubscription.unsubscribe();
    }
  }, []);

  return appState === 'success'
    ? <>
      {loggedIn
        ? <Button className="absolute top-5 left-5" variant="outlined" onClick={userService.logout}>Logout</Button>
        : <></>
      }
      <Outlet />
    </>
  : appState === 'loading'
    ? <div className="h-screen flex justify-center items-center">
      <CircularProgress />
    </div>
    : <></>;
}
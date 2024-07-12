import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { userService } from './services/userService';
//Google: uncomment import here
//import { googleFormsService } from './services/GoogleFormsService';
import { State } from './lib/AsyncState';
import { Navbar } from './components/Navbar';

export default function App() {

  const navigate = useNavigate();

  const [appState, setAppState] = useState<State>('loading');

  useEffect(() => {
    const accessToken: string | null = window.localStorage.getItem('access_token');
    if (accessToken) {
      userService.handleLoginSuccess(JSON.parse(accessToken));
    }

    const loggedInSubscription = userService.loggedIn$.subscribe((logged) => {
      if (!logged) {
        navigate('/login');
      }
      setAppState('success');
    });

    //Google: This is the service call to initialize the token client (which can be used to open the consent screen)
    //googleFormsService.initialize();

    return () => {
      loggedInSubscription.unsubscribe();
    }
  }, []);

  return appState === 'success'
    ? <>
      <Navbar />
      <div className="mt-16 pb-2">
        <Outlet />
      </div>
    </>
    : appState === 'loading'
      ? <div className="h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
      : <></>;
}
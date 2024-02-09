import { AppBar, Button, CircularProgress, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { userService } from './services/UserService';
import { googleFormsService } from './services/GoogleFormsService';
import { State } from './lib/AsyncState';
import { Link as RouterLink } from 'react-router-dom';
import { Code } from '@mui/icons-material';

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
      <AppBar>
        <Toolbar className="flex items-center justify-between" variant="dense">
          {loggedIn
            ? <><div className="flex items-center">
                <Code />
                <Typography className="mr-8">HackEval</Typography>
                <RouterLink to="/">
                  <Button className="text-white">Overview</Button>
                </RouterLink>
              </div>
              <Button className="text-white border-white" onClick={userService.logout}>Logout</Button>
            </>
            : <Typography>HackEval</Typography>
          }
        </Toolbar>
      </AppBar>
      <div className="mt-16">
        <Outlet />
      </div>
    </>
  : appState === 'loading'
    ? <div className="h-screen flex justify-center items-center">
      <CircularProgress />
    </div>
    : <></>;
}
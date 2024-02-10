import { AppBar, Button, CircularProgress, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { userService } from './services/UserService';
import { googleFormsService } from './services/GoogleFormsService';
import { State } from './lib/AsyncState';
import { Link } from 'react-router-dom';
import { Code } from '@mui/icons-material';
import { Subscription } from 'rxjs';
import { filtersService } from './services/FiltersService';

export default function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [appState, setAppState] = useState<State>('loading');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [subscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const accessToken: string | null = window.localStorage.getItem('access_token');
    if(accessToken) {
      userService.handleLoginSuccess(JSON.parse(accessToken));
    }

    subscriptions.push(userService.loggedIn$.subscribe((logged) => {
      setLoggedIn(logged);
      if(!logged) {
        navigate('/login');
      }
      setAppState('success');
    }));

    subscriptions.push(filtersService.filtersOpen$.subscribe((open) => setFiltersOpen(open)));

    googleFormsService.initialize();

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
  }, []);

  return appState === 'success'
    ? <>
      <AppBar>
        <Toolbar className={`flex items-center justify-between ${filtersOpen
          ? 'sm:pr-[13rem] md:pr-[19rem] lg:pr-[26rem] xl:pr-[31rem]'
          : ''
          }`} variant="dense">
          {loggedIn
            ? <><div className="flex items-center">
                <Code />
                <Typography className="mr-8">HackEval</Typography>
                <Link to="/">
                  <Button className="text-white">Overview</Button>
                </Link>
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
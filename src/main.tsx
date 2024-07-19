import ReactDOM from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';
import App from './App.tsx';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { Overview } from './pages/Overview.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import { action as registerAction } from './pages/Register.tsx';
import { action as loginAction } from './pages/Login.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { userService } from './services/userService.ts';
import { Analyses } from './pages/Analyses.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Account from './pages/Account.tsx';
import { Survey } from './pages/Survey.tsx';

const rootElement = document.getElementById('root');

//Passing the rootElement into the defaultProps is necessary to make tailwind work with material
const theme = createTheme({
  components: {
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiDialog: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiModal: {
      defaultProps: {
        container: rootElement,
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Overview />,
        loader: userService.redirectIfNotLoggedIn
      },
      {
        path: '/login',
        element: <Login />,
        action: loginAction,
        loader: userService.redirectIfLoggedIn
      },
      {
        path: '/register',
        element: <Register />,
        action: registerAction,
        loader: userService.redirectIfLoggedIn
      },
      {
        path: '/analysis/:id',
        element: <Analyses />,
        loader: userService.redirectIfNotLoggedIn
      },
      {
        path: '/account',
        element: <Account />,
        loader: userService.redirectIfNotLoggedIn
      },
      {
        path: '/survey',
        element: <Survey />,
        loader: userService.redirectIfNotLoggedIn
      }
    ]
  }
]);

ReactDOM.createRoot(rootElement!).render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <StyledEngineProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  </LocalizationProvider>
);

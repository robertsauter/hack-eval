import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { Overview } from './pages/Overview.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import { action as registerAction } from './pages/Register.tsx';
import { action as loginAction } from './pages/Login.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { userService } from './services/UserService.ts';
import { Analyses } from './pages/Analyses.tsx';

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
        path: '/analysis/:ids',
        element: <Analyses />,
        loader: userService.redirectIfNotLoggedIn
      }
    ]
  }
]);

//Add React strict mode later again
ReactDOM.createRoot(rootElement!).render(
  <StyledEngineProvider>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StyledEngineProvider>
);

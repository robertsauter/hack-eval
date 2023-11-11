import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Overview from './pages/Overview.tsx';
import Register from './pages/Register.tsx';
import App from './App.tsx';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material';

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
        path: '/overview',
        element: <Overview />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      }
    ]
  }
]);

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <StyledEngineProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
);

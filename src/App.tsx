import './App.css';
import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <>
        <Link to={'overview'}>Overview</Link>
        <Link to={'login'}>Login</Link>
        <Link to={'register'}>Register</Link>
        <Outlet />
    </>
  );
}
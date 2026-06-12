import { createBrowserRouter } from 'react-router';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Dashboard from '../features/chat/pages/Dashboard';
import Proctected from '../features/auth/components/Proctected';

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
       path: "/register",
       element: <Register />
    },
    {
        path: '/',
        element : <Proctected><Dashboard /></Proctected>
    }
])
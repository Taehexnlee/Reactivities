import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashBoard from "../../features/activities/dashboard/ActivityDashBoard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetailPage from "../../features/activities/details/ActivityDetailPage";
import Counter from "../../features/counter/Counter";
import RequiredAuth from "./RequiredAuth";
import RegisterForm from "src/features/account/RegisterForm";
import TestErrors from "src/features/errors/TestError";
import NotFound from "src/features/errors/NotFound";
import ServerError from "src/features/errors/ServerError";
import LoginForm from "src/features/account/LoginForm";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {element: <RequiredAuth/> , children: [
                { path: 'activities', element: <ActivityDashBoard /> },
                { path: 'activities/:id', element: <ActivityDetailPage /> },
                { path: 'createActivity', element: <ActivityForm key='create' /> },
                { path: 'manage/:id', element: <ActivityForm /> }
            ]},
            { path: '', element: <HomePage /> },
            { path: 'counter', element: <Counter /> },
            { path: 'errors', element: <TestErrors /> },
            { path: 'not-found', element: <NotFound /> },
            { path: 'server-error', element: <ServerError /> },
            { path: 'login', element: <LoginForm /> },
            { path: 'register', element: <RegisterForm /> },

            { path: '*', element: <Navigate replace to='/not-found' /> }


        ]
    }
])
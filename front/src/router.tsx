import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { JSX, ReactNode } from "react";
import { Provider } from "./provider";
import { DeviceLogin } from "./pages/DeviceLogin";
import { DeviceRegistration } from "./pages/DeviceRegistration";

type ProtectedRoute = {
    path: string;
    Page: () => JSX.Element;
};

type AuthProviderProps = {
    children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
    (async () => {
        try {
            await Provider.getAuthenticationStatus();
        } catch (error) {
            window.location.replace("/login");
            console.error(error);
        }
    })();

    return <>{children}</>;
};

const protectedRoutes: ProtectedRoute[] = [
    {
        path: "/",
        Page: () => (
            <AuthProvider>
                <Home />
            </AuthProvider>
        ),
    },
];

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {protectedRoutes.map(({ path, Page }, index) => {
                    return <Route key={index} path={path} Component={Page} />;
                })}
                <Route path="/login" Component={Login} />
                <Route path="/login/device/:token" Component={DeviceLogin} />
                <Route
                    path="/register/device/:token"
                    Component={DeviceRegistration}
                />
            </Routes>
        </BrowserRouter>
    );
};

import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="" Component={Home} />
                <Route path="/login" Component={Login} />
            </Routes>
        </BrowserRouter>
    );
}

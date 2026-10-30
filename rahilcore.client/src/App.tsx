
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";
import CustomerList from "./pages/customers/CustomerList";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/customers" element={<CustomerList />} />
                </Route>
            </Route>

            <Route
                path="*"
                element={<Navigate to="/customers" replace />}
            />
        </Routes>
    );
}


import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";
import CustomerList from "./pages/customers/CustomerList";
import CustomerDetail from "./pages/customers/CustomerDetail";
import { CustomerProvider } from "./contexts/customers/CustomerProvider";
import Masters from "./pages/masters/Masters";
import OrderList from "./pages/orders/OrderList";
import Leasing from "./pages/leasings/Leasing";
import InspectionList from "./pages/inspections/InspectionList";
import Reports from "./pages/reports/Reports";
import UserList from "./pages/users/UserList";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route element={<CustomerProvider />}>
                        <Route path="/customers" element={<CustomerList />} />
                        <Route path="/customers/:id" element={<CustomerDetail />} />
                    </Route>

                    <Route path="/leasing" element={<Leasing />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/inspections" element={<InspectionList />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/masters" element={<Masters />} />
                </Route>
            </Route>

            <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
            />
        </Routes>
    );
}

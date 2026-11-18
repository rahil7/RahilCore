
import { useNavigate } from "react-router-dom";
import { PageDetailHeader } from "../../../components/layout/PageDetailHeader";
import OrderDetailHeader from "./components/OrderDetailHeader";

export default function OrderDetail() {
    const navigate = useNavigate();

    // Temporary mock data
    const order = {
        id: 1,
        orderNo: "ORDS26111817",
        orderType: "DEALER" as const,
        status: "New Order",
        paymentStatus: "Unpaid",
        createdAt: "18 Nov 2026, 22:27",
        createdBy: "admin",
        isAssigned: false,
    };

    return (
        <div className="space-y-5">
            <PageDetailHeader
                title="Order Detail"
                backTo="/orders"
            />

            <OrderDetailHeader
                orderNo={order.orderNo}
                orderType={order.orderType}
                status={order.status}
                paymentStatus={order.paymentStatus}
                createdAt={order.createdAt}
                createdBy={order.createdBy}
                canEdit={!order.isAssigned}
                onEdit={() => navigate(`/orders/${order.id}/edit`)}
            />
        </div>
    );
}

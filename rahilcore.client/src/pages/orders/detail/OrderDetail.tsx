import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageDetailHeader } from "../../../components/layout/PageDetailHeader";
import type { OrderDetailResponse } from "../../../types/order";

import OrderDetailHeader from "./components/OrderDetailHeader";
import OrderCustomerSection from "./components/OrderCustomerSection";
import OrderInformationSection from "./components/OrderInformationSection";
import OrderVehicleSection from "./components/OrderVehicleSection";
import OrderPaymentSection from "./components/OrderPaymentSection";
import OrderAssignmentSection from "./components/OrderAssignmentSection";
import OrderActivitySection from "./components/OrderActivitySection";
import { orderService } from "../../../services/order-service";

export default function OrderDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [order, setOrder] = useState<OrderDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await orderService.getDetail(Number(id));

                console.log(response);

                setOrder(response.data);
            } catch (err) {
                console.error("Failed to fetch order detail:", err);
                setError("Failed to load order detail.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="space-y-5">
                <PageDetailHeader title="Order Detail" backTo="/orders" />
                <p className="text-sm text-muted-foreground">Loading order detail...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="space-y-5">
                <PageDetailHeader title="Order Detail" backTo="/orders" />
                <p className="text-sm text-destructive">
                    {error ?? "Order not found."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <PageDetailHeader
                title="Order Detail"
                backTo="/orders"
            />

            <OrderDetailHeader
                orderNo={order.orderNo}
                orderType={order.customer.customerType}
                status={order.status}
                paymentStatus={order.paymentStatus}
                createdAt={order.createdAt}
                createdBy={order.createdBy}
                canEdit={!order.isAssigned}
                onEdit={() => navigate(`/orders/${order.id}/edit`)}
            />

            <div className="grid gap-4 lg:grid-cols-2">
                <OrderCustomerSection
                    customer={order.customer}
                    picName={order.picName}
                    picPhone={order.picPhone}
                />

                <OrderInformationSection
                    inspectionForm={order.inspectionFormName}
                    scheduleAt={order.scheduleAt}
                    note={order.note}
                />
            </div>
        </div>
    );
}
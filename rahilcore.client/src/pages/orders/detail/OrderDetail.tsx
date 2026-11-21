import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageDetailHeader } from "../../../components/layout/PageDetailHeader";
import type { CreatePaymentRequest, OrderAssignRequest, OrderDetailResponse, UpdatePaymentRequest } from "../../../types/order";

import OrderDetailHeader from "./components/OrderDetailHeader";
import OrderCustomerSection from "./components/OrderCustomerSection";
import OrderInformationSection from "./components/OrderInformationSection";
import OrderVehicleSection from "./components/OrderVehicleSection";
import OrderPaymentSection from "./components/OrderPaymentSection";
import OrderAssignmentSection from "./components/OrderAssignmentSection";
import OrderActivitySection from "./components/OrderActivitySection";
import { orderService } from "../../../services/order-service";
import type { CachedFileAccess } from "../../../types/file";
import OrderPaymentDialog from "./dialogs/OrderPaymentDialog";
import OrderAssignmentDialog from "./dialogs/OrderAssignmentDialog";

export default function OrderDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [order, setOrder] = useState<OrderDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [paymentDialogKey, setPaymentDialogKey] = useState(0);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [paymentDialogMode, setPaymentDialogMode] = useState<"create" | "edit">("create");

    const openCreatePayment = () => {
        setPaymentDialogMode("create");
        setPaymentDialogKey((prev) => prev + 1);
        setPaymentDialogOpen(true);
    };

    const handleEditPayment = () => {
        setPaymentDialogMode("edit");
        setPaymentDialogKey((prev) => prev + 1);
        setPaymentDialogOpen(true);
    };

    const handleSubmitPayment = async (
        request: CreatePaymentRequest | UpdatePaymentRequest
    ) => {
        if (paymentDialogMode === "create") {
            await orderService.createPayment(
                Number(id),
                request as CreatePaymentRequest
            );
        } else {
            if (!order?.payment) {
                throw new Error("Payment data not found.");
            }

            await orderService.updatePayment(
                Number(id),
                order.payment.paymentId,
                request as UpdatePaymentRequest
            );
        }

        const response = await orderService.getDetail(Number(id));
        setOrder(response.data);
    };
    
    const [proofLoading, setProofLoading] = useState(false);
    const proofCache = useRef<Map<number, CachedFileAccess>>(new Map());

    const handleViewPaymentProof = useCallback(async (paymentId: number) => {
        const cached = proofCache.current.get(paymentId);

        if (cached && Date.now() < cached.expiresAt) {
            window.open(cached.url, "_blank", "noopener,noreferrer");
            return;
        }

        const newTab = window.open("about:blank", "_blank");

        if (!newTab) {
            console.error("Browser blocked the new tab.");
            return;
        }

        try {
            setProofLoading(true);

            const response = await orderService.getPaymentProof(paymentId);

            if (!response.url) {
                throw new Error("Payment proof URL is unavailable.");
            }

            const expiresAt = Date.now() + 14 * 60 * 1000;

            proofCache.current.set(paymentId, {
                url: response.url,
                expiresAt,
            });

            newTab.location.replace(response.url);
        } catch (error) {
            newTab.close();
            console.error("Failed to open payment proof:", error);
        } finally {
            setProofLoading(false);
        }
    }, []);

    const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);

    const handleOpenAssignmentDialog = () => {
        setAssignmentDialogOpen(true);
    };

    const handleAssignInspector = async (request: OrderAssignRequest) => {
        await orderService.assignment(Number(id), request);

        const response = await orderService.getDetail(Number(id));

        setOrder(response.data);
    };

    useEffect(() => {
        if (!id) return;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await orderService.getDetail(Number(id));

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
                statusId={order.statusId}
                statusName={order.statusName}
                paymentStatusId={order.paymentStatusId}
                paymentStatusName={order.paymentStatusName}
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

            <OrderVehicleSection vehicles={order.vehicles} />

            <OrderPaymentSection
                payment={order.payment}
                paymentStatusId={order.paymentStatusId}
                paymentStatusName={order.paymentStatusName}
                proofLoading={proofLoading}
                onCreate={openCreatePayment}
                onEdit={handleEditPayment}
                onViewProof={handleViewPaymentProof}
            />

            <OrderPaymentDialog
                key={paymentDialogKey}
                open={paymentDialogOpen}
                onOpenChange={setPaymentDialogOpen}
                mode={paymentDialogMode}
                payment={order?.payment ?? null}
                onSubmit={handleSubmitPayment}
                onViewPaymentProof={() => {
                    if (order?.payment) {
                        handleViewPaymentProof(order.payment.paymentId);
                    }
                }}
            />

            <OrderAssignmentSection
                assignment={order.assignment}
                canAssign={order.canAssign}
                canReassign={order.canReassign}
                onAssign={handleOpenAssignmentDialog}
                onReassign={handleOpenAssignmentDialog}
            />

            <OrderAssignmentDialog
                open={assignmentDialogOpen}
                onOpenChange={setAssignmentDialogOpen}
                onSubmit={handleAssignInspector}
                currentAssignment={
                    order.assignment
                        ? {
                            inspectorUsername: order.assignment.inspectorUsername,
                            inspectorName: order.assignment.inspectorName,
                            scheduleAt: order.assignment.scheduleAt,
                        }
                        : null
                }
            />

            <OrderActivitySection activities={order.activities} />

        </div>
    );
}
import { useNavigate } from "react-router-dom";
import { Separator } from "../../../components/ui/separator";
import { inspectionStatusConfig, paymentStatusConfig } from "../../../config/status-config";
import StatusBadge from "../../../components/shared/StatusBadge";
import ActivityCell from "../../../components/shared/ActivityCell";
import OrderActions from "../../../features/orders/components/OrderActions";
import type { OrderListItem } from "../../../types/order";

interface OrderMobileCardProps {
    order: OrderListItem;
}

export default function OrderMobileCard({
    order,
}: OrderMobileCardProps) {
    const navigate = useNavigate();

    return (
        <div className="rounded-lg border bg-card p-3 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
                <button
                    type="button"
                    className="text-sm font-semibold hover:underline"
                    onClick={() => navigate(`/orders/${order.id}`)}
                >
                    {order.orderNo}
                </button>

                <div className="flex items-center gap-2">
                    <StatusBadge
                        statusId={order.statusId}
                        label={order.statusName}
                        config={inspectionStatusConfig}
                    />
                    <OrderActions id={order.id} />
                </div>
            </div>

            {/* Customer Information */}
            <div className="mt-3 space-y-1">
                <p className="text-sm font-medium">
                    {order.customerName}
                </p>
                <p className="text-xs text-muted-foreground">
                    {order.customerCode} · {order.customerType}
                </p>
            </div>

            <Separator className="my-3" />

            {/* Order Information */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Payment Status
                    </p>
                    <StatusBadge
                        statusId={order.paymentStatusId}
                        label={order.paymentStatusName}
                        config={paymentStatusConfig}
                    />
                </div>

                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Total Unit
                    </p>
                    <p className="text-sm font-medium">
                        {order.totalUnit}
                    </p>
                </div>
            </div>

            <Separator className="my-3" />

            {/* Activity Information */}
            <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0 space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Created
                    </p>
                    <ActivityCell
                        date={order.createdAt}
                        by={order.createdBy}
                    />
                </div>

                <div className="min-w-0 space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Last Activity
                    </p>
                    <ActivityCell
                        date={order.lastActivityAt}
                        by={order.lastActivityBy}
                        showTime
                    />
                </div>
            </div>
        </div>
    );
}
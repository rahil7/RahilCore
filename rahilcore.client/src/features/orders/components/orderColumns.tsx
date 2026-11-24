import { Link } from "react-router-dom";
import ActivityCell from "../../../components/shared/ActivityCell";
import type { DataTableColumn } from "../../../components/shared/data-table/types";
import StatusBadge from "../../../components/shared/StatusBadge";
import { inspectionStatusConfig, paymentStatusConfig } from "../../../config/status-config";
import type { OrderListItem } from "../../../types/order";
import OrderActions from "./OrderActions";
import CustomerCell from "../../../components/shared/CustomerCell";

export const orderColumns: DataTableColumn<OrderListItem>[] = [
    {
        id: "orderNo",
        header: "Order No",
        align: "center",
        cell: (row) => (
            <Link
                to={`/orders/${row.id}`}
                className="font-semibold text-foreground hover:text-primary hover:underline"
            >
                {row.orderNo}
            </Link>
        ),
    },
    {
        id: "status",
        header: "Status",
        align: "center",
        cell: (row) => (
            <StatusBadge
                statusId={row.statusId}
                label={row.statusName}
                config={inspectionStatusConfig}
            />
        ),
    },
    {
        id: "customer",
        header: "Customer",
        cell: (row) => (
            <CustomerCell
                name={row.customerName}
                code={row.customerCode}
                type={row.customerType}
            />
        )
    },
    {
        id: "paymentStatus",
        header: "Payment Status",
        align: "center",
        cell: (row) => (
            <StatusBadge
                statusId={row.paymentStatusId}
                label={row.paymentStatusName}
                config={paymentStatusConfig}
            />
        ),
    },
    {
        id: "totalUnit",
        header: "Total Unit",
        accessorKey: "totalUnit",
        align: "center",
    },
    {
        id: "createdAt",
        header: "Created",
        cell: (row) => (
            <ActivityCell
                date={row.createdAt}
                by={row.createdBy }
                showTime />
        ),
    },
    {
        id: "lastActivity",
        header: "Last Activity",
        cell: (row) => (
            <ActivityCell
                date={row.lastActivityAt}
                by={row.lastActivityBy}
                showTime
            />
        ),
    },
    {
        id: "actions",
        header: "",
        className: "w-[60px] text-center",
        cell: (row) => <OrderActions id={row.id} />,
    },
];
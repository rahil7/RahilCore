import ActivityCell from "../../../components/shared/ActivityCell";
import type { DataTableColumn } from "../../../components/shared/data-table/types";
import type { OrderListItem } from "../../../types/order";
import OrderActions from "./OrderActions";
import OrderCustomerCell from "./OrderCustomerCell";

export const orderColumns: DataTableColumn<OrderListItem>[] = [
    {
        id: "orderNo",
        header: "Order No",
        accessorKey: "orderNo",
    },
    {
        id: "customer",
        header: "Customer",
        cell: (row) => (
            <OrderCustomerCell
                code={row.customerCode}
                name={row.customerName}
                type={row.customerType}
            />
        )
    },
    {
        id: "statusName",
        header: "Status",
        accessorKey: "statusName",
    },
    {
        id: "paymentStatusName",
        header: "Payment Status",
        accessorKey: "paymentStatusName",
    },
    {
        id: "totalUnit",
        header: "Total Unit",
        accessorKey: "totalUnit",
    },
    {
        id: "createdAt",
        header: "Created",
        cell: (row) => (
            <ActivityCell date={row.createdAt} />
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
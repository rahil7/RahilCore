
import type { DataTableColumn } from "../../../components/shared/data-table/types";
import CustomerActions from "./CustomerActions";
import CustomerCell from "./CustomerCell";
import CustomerActivityCell from "./CustomerActivityCell";
import type { CustomerListItem } from "../../../types/customer";

export const customerColumns: DataTableColumn<CustomerListItem>[] = [
    {
        id: "customer",
        header: "Customer",
        cell: (row) => (
            <CustomerCell
                name={row.custName}
                code={row.custCode}
            />
        ),
    },
    {
        id: "phone",
        header: "Phone",
        accessorKey: "phone",
    },
    {
        id: "email",
        header: "Email",
        accessorKey: "email",
    },
    {
        id: "cityName",
        header: "Kota",
        accessorKey: "cityName",
    },
    {
        id: "status",
        header: "Status",
        cell: (row) => (
            <span
                className={
                    row.isActive
                        ? "text-green-600"
                        : "text-muted-foreground"
                }
            >
                {row.isActive ? "Active" : "Inactive"}
            </span>
        ),
    },
    {
        id: "createdAt",
        header: "Created",
        cell: (row) => (
            <CustomerActivityCell date={row.createdAt} />
        ),
    },
    {
        id: "lastActivity",
        header: "Last Activity",
        cell: (row) => (
            <CustomerActivityCell
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
        cell: (row) => <CustomerActions customerId={row.id} />,
    },
];


import type { DataTableColumn } from "../../../components/shared/data-table/types";
import CustomerActions from "./CustomerActions";
import CustomerCell from "./CustomerCell";
import CustomerActivityCell from "./CustomerActivityCell";

export interface Customer {
    id: number;
    custCode: string;
    custName: string;
    phone: string;
    email: string;
    cityName: string;
    status: string;
    createdAt: string;
    lastActivityAt: string;
    lastActivityBy: string;
}

export const customerColumns: DataTableColumn<Customer>[] = [
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
                    row.status === "Active"
                        ? "text-green-600"
                        : "text-muted-foreground"
                }
            >
                {row.status}
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

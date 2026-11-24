import { Link } from "react-router-dom";
import ActivityCell from "../../../components/shared/ActivityCell";
import type { DataTableColumn } from "../../../components/shared/data-table/types";
import StatusBadge from "../../../components/shared/StatusBadge";
import { inspectionStatusConfig } from "../../../config/status-config";
import type { InspectionListItem } from "../../../types/inspection";
import CustomerCell from "../../../components/shared/CustomerCell";
import VehicleCell from "../../../components/shared/VehicleCell";
import { formatDateTime } from "../../../utils/date-utils";

export const inspectionColumns: DataTableColumn<InspectionListItem>[] = [
    {
        id: "inspectionNo",
        header: "Inspection No",
        align: "center",
        cell: (row) => (
            <Link
                to={`/inspections/${row.id}`}
                className="font-semibold text-foreground hover:text-primary hover:underline"
            >
                {row.inspectionNo}
            </Link>
        ),
    },
    {
        id: "orderNo",
        header: "Order No",
        align: "center",
        accessorKey: "orderNo"
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
        id: "scheduleAt",
        header: "Tanggal Inspeksi",
        align: "center",
        cell: (row) => (formatDateTime(row.scheduleAt))
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
        id: "vehicle",
        header: "Unit",
        cell: (row) => (
            <VehicleCell
                plateNo={row.plateNo}
                brand={row.brand}
                model={row.model}
                variant={row.variant}
            />
        )
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
    }
];
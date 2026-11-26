import { Link } from "react-router-dom";
import {
    CalendarDays,
    UserRound,
    Clock3,
    Activity,
} from "lucide-react";
import { inspectionStatusConfig } from "../../../../config/status-config";
import StatusBadge from "../../../../components/shared/StatusBadge";
import { formatDateTime } from "../../../../utils/date-utils";

interface InspectionDetailHeaderProps {
    inspectionNo: string;
    orderId: number;
    orderNo: string;
    statusId: number;
    statusName: string;
    scheduleAt: string | null;
    inspectorName: string | null;
    createdAt: string | null;
    createdBy: string | null;
    lastActivityAt: string | null;
    lastActivityBy: string | null;
}

export default function InspectionDetailHeader({
    orderId,
    inspectionNo,
    orderNo,
    statusId,
    statusName,
    scheduleAt,
    inspectorName,
    createdAt,
    createdBy,
    lastActivityAt,
    lastActivityBy,
}: InspectionDetailHeaderProps) {
    return (
        <div className="rounded-xl border bg-card p-5 space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                    <h2 className="text-lg font-semibold tracking-tight">
                        {inspectionNo}
                    </h2>

                    <div className="text-sm text-muted-foreground">
                        Order{" "}
                        <Link
                            to={`/orders/${orderId}`}
                            className="font-medium text-primary hover:underline"
                        >
                            {orderNo}
                        </Link>
                    </div>
                </div>

                <StatusBadge
                    statusId={statusId}
                    label={statusName}
                    config={inspectionStatusConfig}
                />
            </div>

            {/* Main Information */}
            <div className="grid gap-x-8 gap-y-5 pt-2 sm:grid-cols-2">
                <InfoItem
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Inspection Date"
                    value={formatDateTime(scheduleAt)}
                />

                <InfoItem
                    icon={<UserRound className="h-4 w-4" />}
                    label="Inspector"
                    value={inspectorName || "—"}
                />
            </div>

            {/* Activity Information */}
            <div className="grid gap-x-8 gap-y-5 border-t pt-5 sm:grid-cols-2">
                <InfoItem
                    icon={<Clock3 className="h-4 w-4" />}
                    label="Created"
                    value={formatDateTime(createdAt)}
                    description={`by ${createdBy || "—"}`}
                />

                <InfoItem
                    icon={<Activity className="h-4 w-4" />}
                    label="Last Activity"
                    value={formatDateTime(lastActivityAt)}
                    description={`by ${lastActivityBy || "—"}`}
                />
            </div>
        </div>
    );
}

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    description?: string;
}

function InfoItem({
    icon,
    label,
    value,
    description,
}: InfoItemProps) {
    return (
        <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 text-muted-foreground">
                {icon}
                <span className="text-sm">{label}</span>
            </div>

            <p className="break-words text-sm font-medium">{value}</p>

            {description && (
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    )
}
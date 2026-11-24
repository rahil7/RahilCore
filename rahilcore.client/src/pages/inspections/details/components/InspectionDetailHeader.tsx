import { Link } from "react-router-dom";
import { CalendarDays, UserRound } from "lucide-react";

interface InspectionDetailHeaderProps {
    inspectionId: number;
    inspectionNo: string;
    orderId: number;
    orderNo: string;
    statusName: string;
    scheduleAt: string | null;
    inspectorName: string | null;
    createdAt: string | null;
    createdBy: string | null;
    lastActivityAt: string | null;
    lastActivityBy: string | null;
}

function formatDateTime(value: string | null) {
    if (!value) return "—";

    return new Date(value).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function InspectionDetailHeader({
    inspectionId,
    orderId,
    inspectionNo,
    orderNo,
    statusName,
    scheduleAt,
    inspectorName,
    createdAt,
    createdBy,
    lastActivityAt,
    lastActivityBy,
}: InspectionDetailHeaderProps) {
    return (
        <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
            {/* Title */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
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

                <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium">
                    {statusName}
                </span>
            </div>

            {/* Main Information */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Inspection Schedule"
                    value={formatDateTime(scheduleAt)}
                />

                <InfoItem
                    icon={<UserRound className="h-4 w-4" />}
                    label="Inspector"
                    value={inspectorName || "—"}
                />
            </div>

            <div className="border-t pt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm">
                        {formatDateTime(createdAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        by {createdBy || "—"}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Activity</p>
                    <p className="text-sm">
                        {formatDateTime(lastActivityAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        by {lastActivityBy || "—"}
                    </p>
                </div>
            </div>
        </div>
    );
}

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-muted-foreground">
                {icon}
            </div>
            <div className="min-w-0 space-y-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}
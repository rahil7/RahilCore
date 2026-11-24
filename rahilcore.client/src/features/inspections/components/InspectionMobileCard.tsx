import { useNavigate } from "react-router-dom";
import { Separator } from "../../../components/ui/separator";
import StatusBadge from "../../../components/shared/StatusBadge";
import ActivityCell from "../../../components/shared/ActivityCell";
import type { InspectionListItem } from "../../../types/inspection";
import { inspectionStatusConfig } from "../../../config/status-config";

interface InspectionMobileCardProps {
    inspection: InspectionListItem;
}

export default function InspectionMobileCard({
    inspection,
}: InspectionMobileCardProps) {
    const navigate = useNavigate();

    return (
        <div className="rounded-lg border bg-card p-3 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
                <button
                    type="button"
                    className="text-sm font-semibold hover:underline"
                    onClick={() =>
                        navigate(`/inspections/${inspection.id}`)
                    }
                >
                    {inspection.inspectionNo}
                </button>

                <StatusBadge
                    statusId={inspection.statusId}
                    label={inspection.statusName}
                    config={inspectionStatusConfig}
                />
            </div>

            {/* Order Information */}
            <div className="mt-2">
                <p className="text-xs text-muted-foreground">
                    {inspection.orderNo}
                </p>
            </div>

            {/* Customer Information */}
            <div className="mt-3 space-y-1">
                <p className="text-sm font-medium">
                    {inspection.customerName}
                </p>

                <p className="text-xs text-muted-foreground">
                    {inspection.customerCode} · {inspection.customerType}
                </p>
            </div>

            <Separator className="my-3" />

            {/* Vehicle Information */}
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                    Vehicle
                </p>

                <p className="text-sm font-medium">
                    {inspection.plateNo || "—"}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                    {[
                        [inspection.brand, inspection.model]
                            .filter(Boolean)
                            .join(" · "),
                        inspection.variant,
                    ]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                </p>
            </div>

            <Separator className="my-3" />

            {/* Inspection Information */}
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                    Inspection Date
                </p>

                <p className="text-sm font-medium">
                    {inspection.scheduleAt}
                </p>
            </div>

            <Separator className="my-3" />

            {/* Activity Information */}
            <div className="min-w-0 space-y-1">
                <p className="text-xs text-muted-foreground">
                    Last Activity
                </p>

                <ActivityCell
                    date={inspection.lastActivityAt}
                    by={inspection.lastActivityBy}
                    showTime
                />
            </div>
        </div>
    );
}
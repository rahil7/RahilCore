import {
    ClipboardList,
    CreditCard,
    UserRound,
    ClipboardCheck,
    CircleDot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Activity } from "../../types/activity";
import { formatDateTime } from "../../utils/date-utils";

interface ActivityHistorySectionProps {
    activities: Activity[];
}

const activityIcons: Record<string, LucideIcon> = {
    ORDER: ClipboardList,
    PAYMENT: CreditCard,
    ASSIGNMENT: UserRound,
    INSPECTION: ClipboardCheck,
};

export default function ActivityHistorySection({
    activities,
}: ActivityHistorySectionProps) {
    return (
        <section className="rounded-xl border bg-card p-5">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold">Activity History</h3>

                <span className="text-sm text-muted-foreground">
                    {activities.length} Activities
                </span>
            </div>

            {/* Activity List */}
            <div className="max-h-[300px] overflow-y-auto pr-2">
                {activities.length > 0 ? (
                    <div>
                        {activities.map((activity, index) => {
                            const Icon =
                                activityIcons[activity.type.toUpperCase()] ??
                                CircleDot;

                            const isLast = index === activities.length - 1;

                            return (
                                <div
                                    key={activity.id}
                                    className="relative flex gap-3"
                                >
                                    {/* Timeline */}
                                    <div className="relative flex shrink-0 flex-col items-center">
                                        <div className="z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-muted">
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                        </div>

                                        {!isLast && (
                                            <div className="absolute top-9 bottom-0 w-px bg-border" />
                                        )}
                                    </div>

                                    {/* Activity Details */}
                                    <div
                                        className={`min-w-0 flex-1 ${!isLast ? "pb-6" : ""
                                            }`}
                                    >
                                        <p className="text-sm font-medium">
                                            {activity.action}
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {activity.description}
                                        </p>

                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {formatDateTime(activity.createdAt)}
                                            {" · "}
                                            {activity.createdBy}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-8">
                        <CircleDot className="h-8 w-8 text-muted-foreground" />

                        <p className="text-sm text-muted-foreground">
                            No activity history available.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
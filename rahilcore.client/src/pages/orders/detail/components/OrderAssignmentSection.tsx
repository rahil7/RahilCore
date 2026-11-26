import { UserRoundSearch, UserRound, Pencil, CalendarDays, Clock3, UserRoundCheck, MessageSquareText } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { formatDateTime } from "../../../../utils/date-utils";
import type { Assignment } from "../../../../types/base";

interface OrderAssignmentSectionProps {
    assignment: Assignment | null;
    canAssign: boolean;
    canReassign: boolean;
    onAssign: () => void;
    onReassign: () => void;
}

export default function OrderAssignmentSection({
    assignment,
    canAssign,
    canReassign,
    onAssign,
    onReassign,
}: OrderAssignmentSectionProps) {
    return (
        <section className="rounded-xl border bg-card p-5">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold">
                    Inspection Assignment
                </h3>

                <Badge
                    variant="outline"
                    className={
                        assignment
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                    }
                >
                    {assignment ? "Assigned" : "Not Assigned"}
                </Badge>
            </div>

            {!assignment ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-8">
                    <UserRoundSearch className="h-8 w-8 text-muted-foreground" />

                    <div className="text-center">
                        <p className="text-sm font-medium">
                            No inspector assigned yet
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Assign an inspector to proceed with the inspection.
                        </p>
                    </div>

                    {canAssign && (
                        <Button size="sm" onClick={onAssign}>
                            <UserRound className="mr-2 h-4 w-4" />
                            Assign
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-5">
                    {/* Assignment Information */}
                    <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Inspector */}
                        <div className="min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <UserRound className="h-4 w-4 shrink-0" />
                                <span className="text-sm">Inspector</span>
                            </div>

                            <p className="break-words text-sm font-medium">
                                {assignment.inspectorName}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                @{assignment.inspectorUsername}
                            </p>
                        </div>

                        {/* Inspection Schedule */}
                        <div className="min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <CalendarDays className="h-4 w-4 shrink-0" />
                                <span className="text-sm">Inspection Date</span>
                            </div>

                            <p className="break-words text-sm font-medium">
                                {formatDateTime(assignment.scheduleAt)}
                            </p>
                        </div>

                        {/* Assigned Date */}
                        <div className="min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock3 className="h-4 w-4 shrink-0" />
                                <span className="text-sm">Tanggal Penugasan</span>
                            </div>

                            <p className="break-words text-sm font-medium">
                                {formatDateTime(assignment.assignedAt)}
                            </p>
                        </div>

                        {/* Assigned By */}
                        <div className="min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <UserRoundCheck className="h-4 w-4 shrink-0" />
                                <span className="text-sm">Assigned Date</span>
                            </div>

                            <p className="break-words text-sm font-medium">
                                {assignment.assignedBy || "-"}
                            </p>
                        </div>
                    </div>

                    {/* Assignment Note */}
                    {assignment.assignedNote && (
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MessageSquareText className="h-4 w-4 shrink-0" />
                                <span className="text-sm">Notes</span>
                            </div>

                            <p className="whitespace-pre-wrap break-words text-sm font-medium">
                                {assignment.assignedNote}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    {canReassign && (
                        <div className="flex justify-end border-t pt-4">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onReassign}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Reassign
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
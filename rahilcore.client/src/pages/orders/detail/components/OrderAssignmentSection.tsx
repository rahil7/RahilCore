
import { UserRoundSearch, UserRound, Pencil } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

interface OrderAssignmentSectionProps {
    assignment: {
        inspectorCode: string;
        inspectorName: string;
        scheduleAt: string;
        assignedAt: string;
        assignedBy: string;
    } | null;
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
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">
                    Inspector Assignment
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
                            Assign Inspector
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Inspector Code
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {assignment.inspectorCode}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Inspector Name
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {assignment.inspectorName}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Schedule Date & Time
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {assignment.scheduleAt}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Assigned Date
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {assignment.assignedAt}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Assigned By
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {assignment.assignedBy}
                            </p>
                        </div>
                    </div>

                    {canReassign && (
                        <div className="mt-5 flex justify-end border-t pt-4">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onReassign}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Reassign Inspector
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

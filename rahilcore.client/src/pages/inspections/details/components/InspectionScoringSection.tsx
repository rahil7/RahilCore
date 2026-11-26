import { Lock, Play, UserRound, Award } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface InspectionScoringSectionProps {
    canStartScoring: boolean;
    onStartScoring?: () => void;
}

export default function InspectionScoringSection({
    canStartScoring,
    onStartScoring,
}: InspectionScoringSectionProps) {
    return (
        <section className="rounded-xl border bg-card p-5 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h3 className="font-semibold">Scoring</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Inspection evaluation
                    </p>
                </div>

                <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
                    Not Started
                </span>
            </div>

            {/* Scoring Information */}
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <UserRound className="h-4 w-4 shrink-0" />
                        <span className="text-sm">Scored By</span>
                    </div>

                    <p className="text-sm font-medium">—</p>
                </div>

                <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="h-4 w-4 shrink-0" />
                        <span className="text-sm">Score</span>
                    </div>

                    <p className="text-sm font-medium">—</p>
                </div>
            </div>

            {/* Scoring Action */}
            {!canStartScoring ? (
                <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-start gap-2">
                        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                        <div className="space-y-1">
                            <p className="text-sm font-medium">
                                Scoring is locked
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Scoring can be started after the inspector
                                submits the inspection result.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <Button
                    className="w-full"
                    onClick={onStartScoring}
                >
                    <Play className="h-4 w-4" />
                    Start Scoring
                </Button>
            )}

        </section>
    );
}
import { Lock, Play } from "lucide-react";
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
        <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h3 className="font-semibold">Scoring</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Inspection evaluation
                    </p>
                </div>

                <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
                    Not Started
                </span>
            </div>

            {!canStartScoring ? (
                <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-start gap-2">
                        <Lock className="mt-0.5 h-4 w-4 text-muted-foreground" />

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
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                                Scored By
                            </p>
                            <p className="text-sm">Not started</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                                Score
                            </p>
                            <p className="text-sm">—</p>
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        onClick={onStartScoring}
                    >
                        <Play className="h-4 w-4" />
                        Start Scoring
                    </Button>
                </>
            )}
        </div>
    );
}
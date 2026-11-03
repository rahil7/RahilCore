import { LoaderCircle } from "lucide-react";

interface ContentLoadingProps {
    message?: string;
    description?: string;
}

export function ContentLoading({
    message = "Memuat data...",
    description = "Mohon tunggu sebentar.",
}: ContentLoadingProps) {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <LoaderCircle className="h-9 w-9 animate-spin text-primary" />

                <div className="space-y-1 text-center">
                    <p className="text-sm font-medium">{message}</p>
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
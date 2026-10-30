interface LoadingOverlayProps {
    message: string;
}

export default function LoadingOverlay({
    message,
}: LoadingOverlayProps) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center
                       bg-background/80 p-4 backdrop-blur-sm"
            role="status"
            aria-live="polite"
            aria-label={message}
        >
            <div
                className="flex w-full max-w-[260px] flex-col items-center
                           gap-4 rounded-2xl border bg-card px-8 py-7
                           text-center shadow-xl"
            >
                <div
                    className="size-10 animate-spin rounded-full border-4
                               border-primary/20 border-t-primary"
                    aria-hidden="true"
                />

                <div>
                    <p className="font-semibold">{message}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Mohon tunggu sebentar...
                    </p>
                </div>
            </div>
        </div>
    );
}

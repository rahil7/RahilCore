import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

interface FilterDialogProps {
    open: boolean;
    title: string;
    children?: ReactNode;
    onClose: () => void;
    onApply: () => void;
}

export default function FilterDialog({
    open,
    title,
    children,
    onClose,
    onApply,
}: FilterDialogProps) {
    useEffect(() => {
        if (!open) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    // Dialog tidak dirender jika tertutup
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="filter-dialog-title"
                className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border bg-card shadow-xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h2
                        id="filter-dialog-title"
                        className="text-base font-semibold"
                    >
                        {title}
                    </h2>

                    <button
                        type="button"
                        aria-label="Tutup"
                        onClick={onClose}
                        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[65vh] overflow-y-auto p-5">
                    {children}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 rounded-md border px-4 text-sm font-medium hover:bg-muted"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={onApply}
                        className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
}

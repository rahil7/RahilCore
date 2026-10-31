import type { ReactNode } from "react";
import { X } from "lucide-react";

interface FilterDialogProps {
    open: boolean;
    title: string;
    children?: ReactNode;
    hasDraftFilters: boolean;
    onClose: () => void;
    onApply: () => void;
    onReset: () => void;
}

export default function FilterDialog({
    open,
    title,
    children,
    hasDraftFilters,
    onClose,
    onApply,
    onReset
}: FilterDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
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
                <div className="min-h-0 p-5">
                    {children}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 border-t bg-muted/20 px-5 py-4">
                    <button
                        type="button"
                        onClick={onReset}
                        disabled={!hasDraftFilters}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-muted-foreground"
                    >
                        Reset pilihan
                    </button>

                    <div className="flex gap-2">
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
        </div>
    );
}

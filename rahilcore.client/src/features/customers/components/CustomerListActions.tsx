import { RefreshCw, Plus, Download } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface CustomerListActionsProps {
    onRefresh: () => void;
    onExport: () => void;
    onAdd: () => void;
    isLoading: boolean;
}

export default function CustomerListActions({
    onRefresh,
    onExport,
    onAdd,
    isLoading,
}: CustomerListActionsProps) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                onClick={onRefresh}
                disabled={isLoading}
                aria-label="Refresh"
                title="Refresh"
                className="size-10 shrink-0 px-0 sm:h-9 sm:w-auto sm:px-4"
            >
                <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
                variant="outline"
                onClick={onExport}
                disabled={isLoading}
                aria-label="Export"
                title="Export"
                className="size-10 shrink-0 px-0 sm:h-9 sm:w-auto sm:px-4"
            >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
            </Button>

            <Button
                onClick={onAdd}
                disabled={isLoading}
                aria-label="Tambah Customer"
                title="Tambah Customer"
                className="size-10 shrink-0 px-0 sm:h-9 sm:w-auto sm:px-4"
            >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Tambah</span>
            </Button>
        </div>
    );
}
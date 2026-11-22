import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    X,
} from "lucide-react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

interface AppToastProps {
    type: ToastType;
    message: string;
    id: string | number;
    duration: number;
}

const toastConfig = {
    success: {
        icon: CheckCircle2,
        title: "Success",
        iconClass: "text-green-600",
        borderClass: "border-green-200",
        bgClass: "bg-green-50",
    },
    error: {
        icon: XCircle,
        title: "Error",
        iconClass: "text-red-600",
        borderClass: "border-red-200",
        bgClass: "bg-red-50",
    },
    warning: {
        icon: AlertTriangle,
        title: "Warning",
        iconClass: "text-amber-600",
        borderClass: "border-amber-200",
        bgClass: "bg-amber-50",
    },
    info: {
        icon: Info,
        title: "Information",
        iconClass: "text-blue-600",
        borderClass: "border-blue-200",
        bgClass: "bg-blue-50",
    },
};

function AppToast({
    type,
    message,
    id,
    duration,
}: AppToastProps) {
    const config = toastConfig[type];
    const Icon = config.icon;

    return (
        <div
            className={`relative w-full overflow-hidden rounded-lg border shadow-lg ${config.borderClass} ${config.bgClass}`}
        >
            {/* Content */}
            <div className="flex items-start gap-3 p-4">
                <Icon
                    className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconClass}`}
                />

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                        {config.title}
                    </p>

                    <p className="mt-1 whitespace-pre-line break-words text-sm text-muted-foreground">
                        {message}
                    </p>
                </div>

                {/* Close */}
                <button
                    type="button"
                    onClick={() => toast.dismiss(id)}
                    className="shrink-0 rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Close notification"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Countdown progress */}
            <div className="h-1 w-full bg-black/5">
                <div
                    className={`app-toast-progress h-full ${type === "success"
                            ? "bg-green-500"
                            : type === "error"
                                ? "bg-red-500"
                                : type === "warning"
                                    ? "bg-amber-500"
                                    : "bg-blue-500"
                        }`}
                    style={{
                        animationDuration: `${duration}ms`,
                    }}
                />
            </div>
        </div>
    );
}

function showAppToast(
    type: ToastType,
    message: string,
    duration = 5000
) {
    return toast.custom(
        (id) => (
            <AppToast
                id={id}
                type={type}
                message={message}
                duration={duration}
            />
        ),
        {
            duration,
        }
    );
}

export const appToast = {
    success: (message: string, duration?: number) =>
        showAppToast("success", message, duration),

    error: (message: string, duration?: number) =>
        showAppToast("error", message, duration),

    warning: (message: string, duration?: number) =>
        showAppToast("warning", message, duration),

    info: (message: string, duration?: number) =>
        showAppToast("info", message, duration),

    dismiss: (id?: string | number) =>
        toast.dismiss(id),
};
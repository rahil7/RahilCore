
import { Bell, UserRound } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { branding } from "../../config/branding";

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
            {/* Workspace identity */}
            <div className="min-w-0">
                <p className="truncate font-semibold">
                    {branding.appName}
                </p>
                <p className="text-xs text-muted-foreground">
                    Business Portal
                </p>
            </div>

            {/* User information */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-label="Notifications"
                    title="Notifications"
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <Bell size={19} />
                </button>

                <div className="hidden h-8 w-px bg-border sm:block" />

                <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-full bg-[#0B2D5C] text-white">
                        <UserRound size={18} />
                    </div>

                    <div className="hidden min-w-0 sm:block">
                        <p className="max-w-40 truncate text-sm font-medium">
                            {user?.displayName ?? "User"}
                        </p>
                        <p className="max-w-40 truncate text-xs text-muted-foreground">
                            @{user?.username ?? "user"}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

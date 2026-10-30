
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    CarFront,
    LogOut,
    ShieldCheck,
    X,
} from "lucide-react";

import { branding } from "../../config/branding";
import { useAuth } from "../../contexts/useAuth";

type SidebarProps = {
    collapsed: boolean;
    onNavigate: () => void;
    onCloseMobile: () => void;
};

export default function Sidebar({
    collapsed,
    onNavigate,
    onCloseMobile,
}: SidebarProps) {
    const { logout } = useAuth();

    const iconOnly = collapsed;

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        [
            "group relative flex items-center rounded-lg border-l-2 py-2.5 text-sm",
            "transition-colors duration-150",
            iconOnly ? "justify-center px-0" : "gap-3 px-3",
            isActive
                ? "border-[#F5B51B] bg-[#0B2D5C] font-medium text-white"
                : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        ].join(" ");

    return (
        <aside className="flex h-full min-h-0 w-full flex-col overflow-x-hidden border-r bg-card">
            {/* Brand */}
            <div
                className={[
                    "flex h-16 shrink-0 items-center border-b",
                    iconOnly ? "justify-center px-2" : "gap-3 px-4",
                ].join(" ")}
            >
                <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0B2D5C] text-white ring-1 ring-[#F5B51B]/40"
                    title={branding.appName}
                >
                    <CarFront size={21} />
                </div>

                {!iconOnly && (
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold tracking-tight">
                            {branding.appName}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                            Vehicle Services
                        </p>
                    </div>
                )}

                {/* Close drawer on mobile */}
                <button
                    type="button"
                    aria-label="Close navigation"
                    title="Close navigation"
                    onClick={onCloseMobile}
                    className="ml-auto inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted md:hidden"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {!iconOnly && (
                    <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Workspace
                    </p>
                )}

                <NavLink
                    to="/dashboard"
                    end
                    title={iconOnly ? "Dashboard" : undefined}
                    onClick={onNavigate}
                    className={navLinkClass}
                >
                    <LayoutDashboard size={18} className="shrink-0" />
                    {!iconOnly && <span>Dashboard</span>}
                </NavLink>

                {!iconOnly && (
                    <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Services
                    </p>
                )}

                {iconOnly && (
                    <div className="my-3 border-t" />
                )}

                <div
                    title={iconOnly ? "Vehicle Inspection (Coming soon)" : undefined}
                    aria-disabled="true"
                    className={[
                        "flex cursor-not-allowed items-center rounded-lg py-2.5 text-sm text-muted-foreground/60",
                        iconOnly ? "justify-center px-0" : "gap-3 px-3",
                    ].join(" ")}
                >
                    <CarFront size={18} className="shrink-0" />
                    {!iconOnly && (
                        <>
                            <span className="min-w-0 flex-1">Vehicle Inspection</span>
                            <span className="text-[10px]">Soon</span>
                        </>
                    )}
                </div>

                <div
                    title={iconOnly ? "Warranty (Coming soon)" : undefined}
                    aria-disabled="true"
                    className={[
                        "flex cursor-not-allowed items-center rounded-lg py-2.5 text-sm text-muted-foreground/60",
                        iconOnly ? "justify-center px-0" : "gap-3 px-3",
                    ].join(" ")}
                >
                    <ShieldCheck size={18} className="shrink-0" />
                    {!iconOnly && (
                        <>
                            <span className="min-w-0 flex-1">Warranty</span>
                            <span className="text-[10px]">Soon</span>
                        </>
                    )}
                </div>
            </nav>

            {/* Sign out */}
            <div
                className={[
                    "shrink-0 border-t p-3",
                    iconOnly ? "flex justify-center" : "",
                ].join(" ")}
            >
                <button
                    type="button"
                    title={iconOnly ? "Sign out" : undefined}
                    onClick={() => {
                        void logout();
                        onNavigate();
                    }}
                    className={[
                        "flex items-center rounded-lg py-2.5 text-sm text-muted-foreground",
                        "transition-colors hover:bg-red-50 hover:text-red-700",
                        "dark:hover:bg-red-950/30 dark:hover:text-red-300",
                        iconOnly ? "justify-center px-0 w-full" : "gap-3 px-3 w-full",
                    ].join(" ")}
                >
                    <LogOut size={18} className="shrink-0" />
                    {!iconOnly && <span>Sign out</span>}
                </button>
            </div>
        </aside>
    );
}

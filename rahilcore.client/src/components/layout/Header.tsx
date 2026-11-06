
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    ChevronDown,
    ChevronRight,
    UserRound,
    UserRoundPen,
    KeyRound,
    LogOut,
} from "lucide-react";

import { useAuth } from "../../contexts/useAuth";

interface BreadcrumbItem {
    label: string;
    path?: string;
}

function getBreadcrumb(pathname: string): BreadcrumbItem[] {
    if (pathname === "/dashboard") {
        return [{ label: "Dashboard" }];
    }

    if (pathname === "/customers") {
        return [{ label: "Customers" }];
    }

    if (pathname.startsWith("/customers/")) {
        const items: BreadcrumbItem[] = [
            { label: "Customers", path: "/customers" },
            { label: "Detail Customer" },
        ];

        if (pathname.endsWith("/edit")) {
            items[1] = {
                label: "Detail Customer",
                path: pathname.replace(/\/edit$/, ""),
            };

            items.push({ label: "Edit Customer" });
        }

        return items;
    }

    const routes: Record<string, string> = {
        "/leasing": "Leasing",
        "/orders": "Orders",
        "/inspections": "Inspections",
        "/reports": "Reports",
        "/masters": "Masters",
        "/users": "User Management",
    };

    return [{ label: routes[pathname] ?? "FAST Inspection" }];
}

export default function Header() {
    const { user, logout } = useAuth();
    const { pathname } = useLocation();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);

    const profileRef = useRef<HTMLDivElement>(null);

    const breadcrumbs = getBreadcrumb(pathname);

    // Close dropdown when clicking outside or pressing Escape
    useEffect(() => {
        if (!isProfileOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setIsProfileOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isProfileOpen]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            setLogoutError(null);

            await logout();

            setIsLogoutOpen(false);
            setIsProfileOpen(false);
        } catch (error) {
            console.error("Failed to sign out:", error);
            setLogoutError("Gagal keluar. Silakan coba kembali.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="flex h-full min-w-0 flex-1 items-center justify-between pl-2 pr-4 sm:pr-6">
            {/* Breadcrumb */}
            <nav
                aria-label="Breadcrumb"
                className="flex min-w-0 items-center gap-2"
            >
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <div
                            key={`${item.label}-${index}`}
                            className="flex min-w-0 items-center gap-2"
                        >
                            {index > 0 && (
                                <ChevronRight
                                    size={15}
                                    className="shrink-0 text-muted-foreground"
                                />
                            )}

                            {isLast ? (
                                <span className="truncate text-sm font-semibold">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    to={item.path ?? "/dashboard"}
                                    className="truncate text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative shrink-0">
                <button
                    type="button"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="menu"
                    onClick={() => setIsProfileOpen((value) => !value)}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted"
                >
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

                    <ChevronDown
                        size={15}
                        className={[
                            "hidden text-muted-foreground transition-transform sm:block",
                            isProfileOpen ? "rotate-180" : "",
                        ].join(" ")}
                    />
                </button>

                {isProfileOpen && (
                    <div
                        role="menu"
                        className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border bg-popover p-1.5 shadow-lg"
                    >
                        {/* Account information */}
                        <div className="flex items-center gap-3 px-3 py-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                                <UserRound size={19} className="text-muted-foreground" />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                    {user?.displayName ?? "User"}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    @{user?.username ?? "user"}
                                </p>
                            </div>
                        </div>

                        <div className="my-1 border-t" />

                        {/* My Profile */}
                        <button
                            type="button"
                            role="menuitem"
                            disabled
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground opacity-60"
                        >
                            <UserRoundPen size={17} />
                            <span className="flex-1 text-left">My Profile</span>
                            <span className="text-[10px]">Soon</span>
                        </button>

                        {/* Change Password */}
                        <button
                            type="button"
                            role="menuitem"
                            disabled
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground opacity-60"
                        >
                            <KeyRound size={17} />
                            <span className="flex-1 text-left">Change Password</span>
                            <span className="text-[10px]">Soon</span>
                        </button>

                        <div className="my-1 border-t" />

                        {/* Sign Out */}
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setIsProfileOpen(false);
                                setLogoutError(null);
                                setIsLogoutOpen(true);
                            }}
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                            <LogOut size={17} />
                            Sign Out
                        </button>
                    </div>
                )}
            </div>

            {/* Logout Confirmation */}
            {isLogoutOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !isLoggingOut
                        ) {
                            setIsLogoutOpen(false);
                        }
                    }}
                >
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="logout-title"
                        aria-describedby="logout-description"
                        className="w-full max-w-sm rounded-xl border bg-card p-5 shadow-xl"
                    >
                        <div className="flex size-10 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                            <LogOut size={19} />
                        </div>

                        <h2
                            id="logout-title"
                            className="mt-4 text-base font-semibold"
                        >
                            Sign Out
                        </h2>

                        <p
                            id="logout-description"
                            className="mt-1 text-sm text-muted-foreground"
                        >
                            Apakah kamu yakin ingin keluar dari FAST Inspection?
                        </p>

                        {logoutError && (
                            <p className="mt-3 text-sm text-destructive">
                                {logoutError}
                            </p>
                        )}

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={() => setIsLogoutOpen(false)}
                                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={() => void handleLogout()}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {isLoggingOut ? "Signing out..." : "Sign Out"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Landmark,
    ClipboardList,
    ClipboardCheck,
    ChartNoAxesCombined,
    Database,
    UsersRound,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { branding } from "../../config/branding";

type SidebarProps = {
    collapsed: boolean;
    onNavigate: () => void;
    onCloseMobile: () => void;
};

type MenuItem = {
    label: string;
    path: string;
    icon: LucideIcon;
};

type MenuGroup = {
    title: string;
    items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
    {
        title: "Workspace",
        items: [
            {
                label: "Dashboard",
                path: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Business",
        items: [
            {
                label: "Customers",
                path: "/customers",
                icon: Users,
            },
            {
                label: "Leasing",
                path: "/leasing",
                icon: Landmark,
            },
        ],
    },
    {
        title: "Operations",
        items: [
            {
                label: "Orders",
                path: "/orders",
                icon: ClipboardList,
            },
            {
                label: "Inspections",
                path: "/inspections",
                icon: ClipboardCheck,
            },
        ],
    },
    {
        title: "Analytics",
        items: [
            {
                label: "Reports",
                path: "/reports",
                icon: ChartNoAxesCombined,
            },
        ],
    },
    {
        title: "Configuration",
        items: [
            {
                label: "Masters",
                path: "/masters",
                icon: Database,
            },
            {
                label: "User Management",
                path: "/users",
                icon: UsersRound,
            },
        ],
    },
];

export default function Sidebar({
    collapsed,
    onNavigate,
    onCloseMobile,
}: SidebarProps) {
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
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0B2D5C] text-white"
                    title={branding.appName}
                >
                    <img
                        src={branding.favicon}
                        alt={branding.appName}
                        className="size-9 object-contain"
                    />
                </div>

                {!iconOnly && (
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold tracking-tight">
                            {branding.appName}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                            {branding.appDescription}
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
                {menuGroups.map((group, groupIndex) => (
                    <div key={group.title}>
                        {/* Group heading */}
                        {!iconOnly ? (
                            <p
                                className={[
                                    "px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                    groupIndex === 0 ? "pt-3" : "pt-5",
                                ].join(" ")}
                            >
                                {group.title}
                            </p>
                        ) : groupIndex > 0 ? (
                            <div className="my-3 border-t" />
                        ) : null}

                        {/* Menu items */}
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === "/dashboard"}
                                        title={iconOnly ? item.label : undefined}
                                        onClick={onNavigate}
                                        className={navLinkClass}
                                    >
                                        <Icon
                                            size={18}
                                            className="shrink-0"
                                        />

                                        {!iconOnly && (
                                            <span className="min-w-0 truncate">
                                                {item.label}
                                            </span>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}


import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function AppLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(min-width: 768px) and (max-width: 1279px)"
        );

        const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
            setIsCollapsed(event.matches);
        };

        handleChange(mediaQuery);
        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    const sidebarCollapsed = isCollapsed;

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile overlay */}
            {isMobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={[
                    "fixed inset-y-0 left-0 z-50",
                    "transition-[width,transform] duration-200 ease-in-out",
                    sidebarCollapsed ? "md:w-[72px]" : "md:w-60",
                    isMobileOpen
                        ? "w-60 translate-x-0"
                        : "w-60 -translate-x-full md:translate-x-0",
                ].join(" ")}
            >
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onNavigate={() => setIsMobileOpen(false)}
                    onCloseMobile={() => setIsMobileOpen(false)}
                />
            </aside>

            {/* Main content */}
            <div
                className={[
                    "flex min-h-screen min-w-0 flex-col",
                    "transition-[margin] duration-200 ease-in-out",
                    sidebarCollapsed ? "md:ml-[72px]" : "md:ml-60",
                ].join(" ")}
            >
                <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-card">
                    {/* Mobile menu button */}
                    <button
                        type="button"
                        aria-label="Open navigation"
                        className="ml-3 inline-flex size-9 items-center justify-center rounded-md text-foreground hover:bg-muted md:hidden"
                        onClick={() => setIsMobileOpen(true)}
                    >
                        <Menu size={20} />
                    </button>

                    {/* Tablet / Desktop collapse button */}
                    <button
                        type="button"
                        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="ml-3 hidden size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground md:inline-flex"
                        onClick={() => setIsCollapsed((value) => !value)}
                    >
                        {sidebarCollapsed
                            ? <PanelLeftOpen size={19} />
                            : <PanelLeftClose size={19} />
                        }
                    </button>

                    <div className="min-w-0 flex-1">
                        <Header />
                    </div>
                </header>

                <main className="min-w-0 flex-1 px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4 lg:px-6 lg:pb-6 lg:pt-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

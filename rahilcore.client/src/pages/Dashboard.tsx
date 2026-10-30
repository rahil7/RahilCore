
import {
    ArrowRight,
    CarFront,
    ClipboardCheck,
    Clock3,
    ShieldCheck,
    Users,
} from "lucide-react";

const modules = [
    {
        title: "Vehicle Inspection",
        description: "Kelola pemeriksaan kendaraan dan laporan inspeksi.",
        icon: ClipboardCheck,
        status: "Persiapan",
    },
    {
        title: "Warranty Management",
        description: "Kelola data garansi kendaraan dan komponen.",
        icon: ShieldCheck,
        status: "Persiapan",
    },
    {
        title: "Vehicle Data",
        description: "Pusat data kendaraan yang terdaftar.",
        icon: CarFront,
        status: "Persiapan",
    },
    {
        title: "User Management",
        description: "Kelola akun dan akses pengguna aplikasi.",
        icon: Users,
        status: "Dalam pengembangan",
    },
];

const stats = [
    { label: "Total Inspections", icon: ClipboardCheck },
    { label: "Pending Inspections", icon: Clock3 },
    { label: "Active Warranties", icon: ShieldCheck },
    { label: "Registered Vehicles", icon: CarFront },
];

export default function Dashboard() {
    return (
        <div className="mx-auto w-full max-w-screen-2xl space-y-8">
            {/* Page heading */}
            <section>
                <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
                    FAST Inspection
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Ringkasan aktivitas inspeksi kendaraan dan layanan garansi Anda.
                </p>
            </section>

            {/* Summary cards */}
            <section>
                <div className="mb-4">
                    <h2 className="font-semibold">Overview</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ringkasan akan tersedia setelah modul dan API terkait dibuat.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map(({ label, icon: Icon }) => (
                        <article
                            key={label}
                            className="rounded-xl border bg-card p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-medium text-muted-foreground">
                                    {label}
                                </p>

                                <div className="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                                    <Icon size={20} />
                                </div>
                            </div>

                            <p className="mt-5 text-2xl font-semibold text-foreground">
                                —
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Belum tersedia
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Modules */}
            <section>
                <div className="mb-4">
                    <h2 className="font-semibold">Application Modules</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Modul utama yang akan dikembangkan untuk FAST Inspection.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {modules.map(({ title, description, icon: Icon, status }) => (
                        <article
                            key={title}
                            className="group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-amber-400/70"
                        >
                            <div className="flex items-start gap-4">
                                <div className="rounded-xl bg-[#0B2D5C] p-3 text-white">
                                    <Icon size={22} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold">{title}</h3>

                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        {description}
                                    </p>

                                    <span className="mt-3 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-400/10 dark:text-amber-300">
                                        {status}
                                    </span>
                                </div>

                                <ArrowRight
                                    size={18}
                                    className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

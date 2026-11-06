
import {
    CarFront,
    MapPin,
    SlidersHorizontal,
    Construction,
} from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";

const masterCategories = [
    {
        title: "Vehicle Catalog",
        description: "Kelola brand, model, dan variant kendaraan.",
        icon: CarFront,
    },
    {
        title: "Cities",
        description: "Kelola data kota.",
        icon: MapPin,
    },
    {
        title: "Parameters",
        description: "Kelola parameter data.",
        icon: SlidersHorizontal,
    }
];

export default function Masters() {
    return (
        <div className="w-full min-w-0 space-y-3">
            <PageHeader
                title="Masters"
                description="Kelola data referensi untuk kebutuhan operasional."
            />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {masterCategories.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="flex items-start gap-3 rounded-xl border bg-card p-4"
                        >
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <Icon className="size-5 text-muted-foreground" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold">
                                    {item.title}
                                </h3>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {item.description}
                                </p>

                                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Construction className="size-3.5" />
                                    Coming Soon
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

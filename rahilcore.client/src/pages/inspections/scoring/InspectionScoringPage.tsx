import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CarFront,
    ClipboardCheck,
    FileText,
    Gauge,
    Image,
    ShieldAlert,
    Wrench,
} from "lucide-react";

import { Button } from "../../../components/ui/button";

const inspectionSections = [
    {
        id: "interior",
        label: "Interior",
        icon: CarFront,
        completed: false,
        itemCount: 12,
    },
    {
        id: "dashboard",
        label: "Dashboard & Electrical",
        icon: Gauge,
        completed: false,
        itemCount: 8,
    },
    {
        id: "instruments",
        label: "Instruments",
        icon: ClipboardCheck,
        completed: false,
        itemCount: 6,
    },
    {
        id: "interior-trim",
        label: "Interior Trim",
        icon: CarFront,
        completed: false,
        itemCount: 8,
    },
    {
        id: "exterior",
        label: "Exterior",
        icon: CarFront,
        completed: false,
        itemCount: 10,
    },
    {
        id: "major-accident",
        label: "Major Accident Indication",
        icon: ShieldAlert,
        completed: false,
        itemCount: 5,
    },
    {
        id: "engine",
        label: "Engine Verification",
        icon: Wrench,
        completed: false,
        itemCount: 5,
    },
    {
        id: "documents",
        label: "Documents",
        icon: FileText,
        completed: false,
        itemCount: 4,
    },
    {
        id: "photos",
        label: "Photos",
        icon: Image,
        completed: false,
        itemCount: 12,
    },
];

export default function InspectionScoringPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState("interior");

    const currentSection = inspectionSections.find(
        (section) => section.id === activeSection
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="mb-4 flex items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/inspections/${id}`)}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                <h1 className="text-xl font-semibold tracking-tight">
                    Inspection Scoring
                </h1>
            </div>

            {/* Inspection Information */}
            <div className="mb-5 rounded-xl border bg-card">
                {/* Inspection Header */}
                <div className="flex items-start justify-between gap-4 border-b p-5">
                    <div className="min-w-0">
                        <h2 className="font-semibold">
                            IPC26112100011
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Order ORD26111510
                        </p>
                    </div>

                    <span className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium">
                        Under Scoring
                    </span>
                </div>

                {/* Vehicle Information */}
                <div className="flex items-center gap-3 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <CarFront className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <p className="text-sm font-semibold">
                            BB 8017 BS
                        </p>

                        <p className="break-words text-sm text-muted-foreground">
                            Audi A5 · 2.0 TFSI X-Line · 2025
                        </p>
                    </div>
                </div>
            </div>

            {/* Workspace */}
            <div className="flex min-h-0 flex-1 flex-col px-5 pt-4">
                {/* Section Tabs */}
                <div className="shrink-0 overflow-x-auto border-b">
                    <nav className="flex w-max min-w-full gap-1">
                        {inspectionSections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;

                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => setActiveSection(section.id)}
                                    className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${isActive
                                            ? "border-primary text-primary"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {section.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content - Scrollable */}
                <div className="min-h-0 flex-1 overflow-y-auto py-4">
                    <section className="rounded-xl border bg-card p-5">
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold">
                                {currentSection?.label}
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Review and update inspection results for this section.
                            </p>
                        </div>

                        {/* Placeholder */}
                        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center">
                            <ClipboardCheck className="mb-3 h-10 w-10 text-muted-foreground" />

                            <p className="text-sm font-medium">
                                Inspection checklist will appear here
                            </p>

                            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                                Checklist items, inspection conditions, notes,
                                and photos will be displayed in this area.
                            </p>
                        </div>
                    </section>
                </div>
            </div>

            {/* Sticky Footer */}
            <footer className="fixed bottom-0 right-0 z-20 border-t bg-card">
                <div className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="hidden text-sm text-muted-foreground sm:block">
                        Inspection progress: 0%
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline">
                            Save Draft
                        </Button>

                        <Button disabled>
                            Complete Scoring
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
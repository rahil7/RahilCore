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
    ChevronDown,
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

const scoringTabs = [
    "Inspection Points",
    "Verification Checklist",
    "Documents",
    "Photos",
];

const inspectionPointMock = [
    {
        id: 1,
        name: "Interior",
        features: [
            {
                id: 101,
                name: "Front Seat",
                items: [
                    { id: 1001, name: "Seat Adjustment" },
                    { id: 1002, name: "Seat Upholstery" },
                    { id: 1003, name: "Headrest" },
                ],
            },
            {
                id: 102,
                name: "Rear Seat",
                items: [
                    { id: 1004, name: "Seat Upholstery" },
                    { id: 1005, name: "Seat Belt" },
                ],
            },
            {
                id: 103,
                name: "Carpet & Floor",
                items: [
                    { id: 1006, name: "Carpet Condition" },
                    { id: 1007, name: "Floor Condition" },
                ],
            },
        ],
    },
];

export default function InspectionScoringPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("Inspection Points");
    const [openSection, setOpenSection] = useState<string | null>("interior");

    return (
        <div className="flex min-h-0 flex-col bg-background">
            {/* Page Header */}
            <div className="mb-4 flex shrink-0 items-center gap-3">
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
            <div className="mb-5 shrink-0 rounded-xl border bg-card">
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

            {/* Scoring Workspace */}
            <div className="flex min-h-[500px] flex-col rounded-xl border bg-card">

                {/* Workspace Header - Tabs */}
                <div className="shrink-0 border-b px-5">
                    <nav className="flex overflow-x-auto">
                        {scoringTabs.map((tab) => {
                            const isActive = activeTab === tab;

                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={`shrink-0 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${isActive
                                            ? "border-primary text-primary"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Workspace Content - Scrollable */}
                <div className="flex-1 p-4">

                    {/* Inspection Points */}
                    {activeTab === "Inspection Points" && (
                        <div className="space-y-3">
                            {inspectionSections.map((section) => {
                                const Icon = section.icon;
                                const isOpen = openSection === section.id;

                                return (
                                    <div
                                        key={section.id}
                                        className="overflow-hidden rounded-lg border"
                                    >
                                        {/* Accordion Trigger */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenSection(
                                                    isOpen
                                                        ? null
                                                        : section.id
                                                )
                                            }
                                            className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${isOpen
                                                    ? "bg-muted/40"
                                                    : "hover:bg-muted/30"
                                                }`}
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />

                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold">
                                                        {section.label}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        {section.itemCount} items
                                                    </p>
                                                </div>
                                            </div>

                                            <ChevronDown
                                                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>

                                        {/* Accordion Content */}
                                        {isOpen && (
                                            <div className="space-y-5 border-t p-5">
                                                {inspectionPointMock
                                                    .find((point) => point.id.toString() === section.id)
                                                    ?.features.map((feature) => (
                                                        <div key={feature.id} className="space-y-3">
                                                            {/* Feature Header */}
                                                            <h3 className="text-sm font-semibold">
                                                                {feature.name}
                                                            </h3>

                                                            {/* Inspection Items */}
                                                            <div className="overflow-hidden rounded-lg border divide-y">
                                                                {feature.items.map((item) => (
                                                                    <div
                                                                        key={item.id}
                                                                        className="flex items-center justify-between gap-4 px-4 py-3"
                                                                    >
                                                                        <p className="text-sm">
                                                                            {item.name}
                                                                        </p>

                                                                        <span className="text-xs text-muted-foreground">
                                                                            Not scored
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Verification Checklist */}
                    {activeTab === "Verification Checklist" && (
                        <div className="flex min-h-full flex-col">
                            <h2 className="mb-4 text-sm font-semibold">
                                Verification Checklist
                            </h2>

                            <div className="flex min-h-[240px] flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                                <ClipboardCheck className="mb-3 h-8 w-8 text-muted-foreground" />

                                <p className="text-sm font-medium">
                                    Verification checklist
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Verification checklist will appear here.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    {activeTab === "Documents" && (
                        <div className="flex min-h-full flex-col">
                            <h2 className="mb-4 text-sm font-semibold">
                                Documents
                            </h2>

                            <div className="flex min-h-[240px] flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                                <FileText className="mb-3 h-8 w-8 text-muted-foreground" />

                                <p className="text-sm font-medium">
                                    Inspection Documents
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Documents will appear here.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Photos */}
                    {activeTab === "Photos" && (
                        <div className="flex min-h-full flex-col">
                            <h2 className="mb-4 text-sm font-semibold">
                                Photos
                            </h2>

                            <div className="flex min-h-[240px] flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                                <Image className="mb-3 h-8 w-8 text-muted-foreground" />

                                <p className="text-sm font-medium">
                                    Inspection Photos
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Inspection photos will appear here.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Workspace Footer - Fixed inside card */}
                <footer className="shrink-0 border-t bg-card px-5 py-3">
                    <div className="flex items-center justify-between gap-3">
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
        </div>
    );
}
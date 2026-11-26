import { useEffect, useState } from "react";
import { PageDetailHeader } from "../../components/layout/PageDetailHeader";
import type { InspectionDetailResponse } from "../../types/inspection";
import InspectionDetailHeader from "./details/components/InspectionDetailHeader";
import { inspectionService } from "../../services/inspection-service";
import { useInspectionContext } from "../../contexts/inspections/useInspectionContext";
import { useNavigate, useParams } from "react-router-dom";
import InspectionCustomerSection from "./details/components/InspectionCustomerSection";
import InspectionInformationSection from "./details/components/InspectionInformationSection";
import ActivityHistorySection from "../../components/shared/ActivityHistorySection";
import InspectionVehicleSection from "./details/components/InspectionVehicleSection";
import InspectionResultSection from "./details/components/InspectionResultSection";
import InspectionScoringSection from "./details/components/InspectionScoringSection";

export default function InspectionDetail() {
    const title: string = "Inspection Detail";
    const backTo: string = "/inspections";

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setShouldRefresh } = useInspectionContext();

    const [inspection, setInspection] = useState<InspectionDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await inspectionService.getDetail(Number(id));

                console.log(response.data);

                setInspection(response.data);
            } catch (err) {
                console.error("Failed to fetch order detail:", err);
                setError("Failed to load order detail.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="space-y-5">
                <PageDetailHeader title={title} backTo={backTo} />
                <p className="text-sm text-muted-foreground">Loading order detail...</p>
            </div>
        );
    }

    if (error || !inspection) {
        return (
            <div className="space-y-5">
                <PageDetailHeader title={title} backTo={backTo} />
                <p className="text-sm text-destructive">
                    {error ?? "Inspection not found."}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 space-y-5">
            <PageDetailHeader title={title} backTo={backTo} />

            {/* Header */}
            <InspectionDetailHeader
                inspectionNo={inspection.inspectionNo}
                orderId={inspection.orderId}
                orderNo={inspection.orderNo}
                statusId={inspection.statusId}
                statusName={inspection.statusName}
                scheduleAt={inspection.scheduleAt}
                inspectorName={inspection.assignment?.inspectorName ?? null}
                createdAt={inspection.createdAt}
                createdBy={inspection.createdBy}
                lastActivityAt={inspection.lastActivityAt}
                lastActivityBy={inspection.lastActivityBy}
            />

            {/* Customer & Inspection Information */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InspectionCustomerSection
                    customer={inspection.customer}
                />

                <InspectionInformationSection
                    inspectionFormName={inspection.inspectionFormName}
                    scheduleAt={inspection.scheduleAt}
                    inspectorName={inspection.assignment?.inspectorName ?? null}
                    assignedAt={inspection.assignment?.assignedAt ?? null}
                    contactPerson={inspection.picName }
                    contactPhone={inspection.picPhone }
                    submittedAt={null}
                />
            </div>

            {/* Vehicle */}
            <InspectionVehicleSection
                vehicle={inspection.vehicle}
            />

            {/* Result & Scoring */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InspectionResultSection />

                <InspectionScoringSection
                    canStartScoring={true}
                    onStartScoring={() => { navigate(`/inspections/${id}/scoring`) } }
                />
            </div>

            {/* Activity */}
            <ActivityHistorySection activities={ inspection.activities } />
        </div>
    );
}
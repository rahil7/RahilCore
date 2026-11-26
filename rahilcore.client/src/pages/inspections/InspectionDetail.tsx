import { useEffect, useState } from "react";
import { PageDetailHeader } from "../../components/layout/PageDetailHeader";
import type { InspectionDetailResponse } from "../../types/inspection";
import InspectionDetailHeader from "./details/components/InspectionDetailHeader";
import { inspectionService } from "../../services/inspection-service";
import { useInspectionContext } from "../../contexts/inspections/useInspectionContext";

export default function InspectionDetail() {
    const title: string = "Inspection Detail";
    const backTo: string = "/inspections";

    const { id } = useParams<{ id: string }>();
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
                <PageDetailHeader title={title} backTo={ backTo } />
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
                inspectionId={inspection.id}
                inspectionNo={inspection.inspectionNo}
                orderId={inspection.order.id}
                orderNo={inspection.order.orderNo}
                statusName={inspection.statusName}
                scheduleAt={inspection.scheduleAt}
                inspectorName={inspection.inspector?.name ?? null}
                createdAt={inspection.createdAt}
                createdBy={inspection.createdBy}
                lastActivityAt={inspection.lastActivityAt}
                lastActivityBy={inspection.lastActivityBy}
            />

            {/* Customer & Inspection Information */}
{/*             <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InspectionCustomerSection
                    customer={inspection.customer}
                />

                <InspectionInformationSection
                    inspectionFormName={inspection.inspectionFormName}
                    scheduleAt={inspection.scheduleAt}
                    inspectorName={inspection.inspector?.name ?? null}
                    assignedAt={inspection.assignedAt}
                    submittedAt={inspection.submittedAt}
                />
            </div> */}

            {/* Vehicle */}
{/*             <InspectionVehicleSection
                vehicle={inspection.vehicle}
            /> */}

            {/* Result & Scoring */}
{/*             <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InspectionResultSection />

                <InspectionScoringSection
                    canStartScoring={canStartScoring}
                    onStartScoring={handleStartScoring}
                />
            </div> */}

            {/* Activity */}
            {/* <InspectionActivitySection /> */}
        </div>
    );
}
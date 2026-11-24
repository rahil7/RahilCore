import { PageDetailHeader } from "../../components/layout/PageDetailHeader";
import InspectionActivitySection from "./details/components/InspectionActivitySection";
import InspectionCustomerSection from "./details/components/InspectionCustomerSection";
import InspectionDetailHeader from "./details/components/InspectionDetailHeader";
import InspectionInformationSection from "./details/components/InspectionInformationSection";
import InspectionResultSection from "./details/components/InspectionResultSection";
import InspectionScoringSection from "./details/components/InspectionScoringSection";
import InspectionVehicleSection from "./details/components/InspectionVehicleSection";
import { inspectionDetailMock } from "./details/mock/inspection-detail-mock";

export default function InspectionDetail() {
    const inspection = inspectionDetailMock;

    // Mock permission/status:
    // Inspection Submitted -> scoring can be started
    const canStartScoring = inspection.statusName === "Inspection Submitted";

    const handleStartScoring = () => {
        console.log("Start scoring:", inspection.id);
    };

    return (
        <div className="w-full min-w-0 space-y-5">
            <PageDetailHeader
                title="Inspection Detail"
                backTo="/inspections"
            />

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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
            </div>

            {/* Vehicle */}
            <InspectionVehicleSection
                vehicle={inspection.vehicle}
            />

            {/* Result & Scoring */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InspectionResultSection />

                <InspectionScoringSection
                    canStartScoring={canStartScoring}
                    onStartScoring={handleStartScoring}
                />
            </div>

            {/* Activity */}
            <InspectionActivitySection />
        </div>
    );
}
using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.Inspections
{
    public sealed class InspectionOrderItemEn : BaseAuditCreatedEntity
    {
        public long OrderId { get; set; }
        public InspectionOrderEn? Order { get; set; }

        public long VehicleId { get; set; }
        public VehicleEn? Vehicle { get; set; }

        public long InspectionFormId { get; set; }
        public MasterInspectionFormEn? InspectionForm { get; set; }
    }
}

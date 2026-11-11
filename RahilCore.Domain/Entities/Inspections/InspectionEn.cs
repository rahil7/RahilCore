using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.Inspections
{
    public sealed class InspectionEn : BaseAuditCreatedEntity
    {
        public long OrderItemId { get; set; }
        public InspectionOrderItemEn? OrderItem { get; set; }

        public string InspectionNo { get; set; } = null!;
        public DateTime StartedAt { get; set; }
        public DateTime ReceivedAt { get; set; }
        public DateTime SubmittedAt { get; set; }
        public string SubmittedBy { get; set; } = null!;
    }
}

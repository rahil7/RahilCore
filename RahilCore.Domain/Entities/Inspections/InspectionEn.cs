using RahilCore.Domain.Entities.Common;
using RahilCore.Domain.Entities.Orders;

namespace RahilCore.Domain.Entities.Inspections
{
    public sealed class InspectionEn : BaseAuditCreatedEntity
    {
        public long OrderItemId { get; set; }
        public InspectionOrderItemEn? OrderItem { get; set; }

        public string InspectionNo { get; set; } = null!;
        public DateTime? StartedAt { get; set; }   // Waktu inspector mulai inspeksi (klik Start)
        public DateTime? SubmittedAt { get; set; } // Waktu inspector submit inspeksi (klik Submit)
        public DateTime? ReceivedAt { get; set; }   // Waktu server menerima data
        public string? SubmittedBy { get; set; }
        
        public decimal? CurrentScore { get; set; }
        public string? CurrentGrade { get; set; }
        
        public DateTime? ScoredAt { get; set; }
        public string? ScoredBy { get; set; }
        public string? ScoredNote { get; set; }

        public DateTime? ApprovedAt { get; set; }
        public string? ApprovedBy { get; set; }
        public string? ApprovedNote { get; set; }
    }
}

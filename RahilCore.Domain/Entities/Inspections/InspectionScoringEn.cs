using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.Inspections
{
    public sealed class InspectionScoringEn : BaseMasterEntity
    {
        public long InspectionId { get; set; }
        public int ScoringNo { get; set; }
        public long StatusId { get; set; }
        public decimal? Score { get; set; }
        public string? Grade { get; set; }
        public DateTime ScoredAt { get; set; }
        public string? ScoredBy { get; set; }
        public string? ScoredNote { get; set; }
    }
}

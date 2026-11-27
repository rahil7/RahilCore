using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.Inspections
{
    public sealed class InspectionResultFileEn : BaseMasterEntity
    {
        public long ResultId { get; set; }
        public string FileName { get; set; } = null!;
        public string ObjectKey { get; set; } = null!;
        public string? ContentType { get; set; }
        public long FileSize { get; set; }
        public int SortNo { get; set; }
    }
}

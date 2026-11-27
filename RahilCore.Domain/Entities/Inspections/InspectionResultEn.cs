using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.Inspections
{
    public sealed class InspectionResultEn : BaseMasterEntity
    {
        public long InspectionId { get; set; }
        public long FormItemId { get; set; }
        public long Value { get; set; }
        public long Note { get; set; }
    }
}

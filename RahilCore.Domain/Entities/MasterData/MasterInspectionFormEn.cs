using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities
{
    public sealed class MasterInspectionFormEn : BaseMasterEntity
    {
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}

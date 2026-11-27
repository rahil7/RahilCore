using RahilCore.Domain.Entities.Common;

namespace RahilCore.Infrastructure.Persistence.Configurations.MasterData
{
    public sealed class MasterInspectionSectionEn : BaseMasterEntity
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int SortNo { get; set; }
    }
}

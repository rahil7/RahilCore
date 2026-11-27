using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.MasterData
{
    public sealed class MasterInspectionItemEn : BaseMasterEntity
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int SortNo { get; set; }
    }
}

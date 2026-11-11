using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.MasterData
{
    public sealed class MasterColorEn : BaseMasterEntity
    {
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
    }
}

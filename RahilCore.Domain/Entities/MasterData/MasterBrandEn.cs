using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.MasterData
{
    public sealed class MasterBrandEn : BaseMasterEntity
    {
        public string Name { get; set; } = null!;
        public long CountryOfOriginId { get; set; }
        public MasterParameterEn? CountryOfOrigin { get; set; }
    }
}

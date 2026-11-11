using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.MasterData
{
    public sealed class MasterModelEn : BaseMasterEntity
    {
        public string Name { get; set; } = null!;
        public long BrandId { get; set; }
        public MasterBrandEn? Brand { get; set; }
    }
}

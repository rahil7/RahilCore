using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.MasterData
{
    public sealed class MasterVariantEn : BaseMasterEntity
    {
        public string Name { get; set; } = null!;
        public long BrandId { get; set; }
        public MasterBrandEn? Brand { get; set; }
        public long ModelId { get; set; }
        public MasterModelEn? Model { get; set; }
    }
}

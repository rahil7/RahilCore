namespace RahilCore.Domain.Entities
{
    public sealed class MasterVariantEn : BaseEntity
    {
        public string Name { get; set; } = null!;
        public long BrandId { get; set; }
        public MasterBrandEn? Brand { get; set; }
        public long ModelId { get; set; }
        public MasterModelEn? Model { get; set; }
    }
}

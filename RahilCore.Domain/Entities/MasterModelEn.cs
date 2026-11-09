namespace RahilCore.Domain.Entities
{
    public sealed class MasterModelEn : BaseEntity
    {
        public string Name { get; set; } = null!;
        public long BrandId { get; set; }
        public MasterBrandEn? Brand { get; set; }
    }
}

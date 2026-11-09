namespace RahilCore.Domain.Entities
{
    public sealed class MasterBrandEn : BaseEntity
    {
        public string Name { get; set; } = null!;
        public long CountryOfOriginId { get; set; }
        public MasterParameterEn? CountryOfOrigin { get; set; }
    }
}

namespace RahilCore.Domain.Entities
{
    public sealed class CityEn : BaseEntity
    {
        public string? Code { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}

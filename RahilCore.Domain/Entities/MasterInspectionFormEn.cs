namespace RahilCore.Domain.Entities
{
    public sealed class MasterInspectionFormEn : BaseEntity
    {
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}

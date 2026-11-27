namespace RahilCore.Application.Common.DTOs
{
    public abstract class BaseInspectionSectionDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int SortNo { get; set; }
    }
}

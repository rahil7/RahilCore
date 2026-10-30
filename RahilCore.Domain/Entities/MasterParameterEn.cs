namespace RahilCore.Domain.Entities
{
    public sealed class MasterParameterEn : BaseEntity
    {
        public string ParamType { get; set; } = string.Empty;

        public string ParamCode { get; set; } = string.Empty;

        public string ParamName { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int SortOrder { get; set; }
    }
}

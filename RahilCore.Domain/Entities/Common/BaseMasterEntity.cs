namespace RahilCore.Domain.Entities.Common
{
    public abstract class BaseMasterEntity : BaseAuditCreatedEntity
    {
        public bool IsActive { get; set; } = true;

        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public string? UpdatedNote { get; set; }
    }
}

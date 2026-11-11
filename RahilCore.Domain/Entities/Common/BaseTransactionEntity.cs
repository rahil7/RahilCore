namespace RahilCore.Domain.Entities.Common
{
    public abstract class BaseTransactionEntity : BaseAuditCreatedEntity
    {
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public string? UpdatedNote { get; set; }
    }
}

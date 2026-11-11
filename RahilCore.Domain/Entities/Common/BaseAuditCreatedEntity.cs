namespace RahilCore.Domain.Entities.Common
{
    public abstract class BaseAuditCreatedEntity
    {
        public long Id { get; set; }

        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? CreatedNote { get; set; }
    }
}

namespace RahilCore.Application.Common.DTOs
{
    public abstract class AuditableDto
    {
        public long Id { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime LastActivityAt { get; set; }

        public string LastActivityBy { get; set; } = string.Empty;

        public string? LastActivityNote { get; set; }
    }
}

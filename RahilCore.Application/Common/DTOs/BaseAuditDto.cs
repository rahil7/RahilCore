namespace RahilCore.Application.Common.DTOs
{
    public abstract class BaseAuditDto
    {
        public long Id { get; set; }

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;

        public string? CreatedNote { get; set; }

        public DateTime LastActivityAt { get; set; }

        public string LastActivityBy { get; set; } = string.Empty;

        public string? LastActivityNote { get; set; }
    }
}

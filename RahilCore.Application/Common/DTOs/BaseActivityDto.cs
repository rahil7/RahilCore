namespace RahilCore.Application.Common.DTOs
{
    public class BaseActivityDto
    {
        public long Id { get; set; }
        public string Action { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }
}

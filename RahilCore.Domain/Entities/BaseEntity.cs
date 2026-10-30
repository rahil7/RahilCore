namespace RahilCore.Domain.Entities
{
    public abstract class BaseEntity
    {
        public long Id { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public string? UpdatedBy { get; set; }

        public string? CreatedNote { get; set; }

        public string? UpdatedNote { get; set; }
    }
}

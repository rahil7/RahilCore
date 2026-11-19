namespace RahilCore.Domain.Entities
{
    public sealed class ActivityLogEn
    {
        public long Id { get; set; }
        public long OrderId { get; set; }
        public long? OrderItemId { get; set; }
        public string EntitiyType { get; set; } = null!;
        public long? EntitiyId { get; set; }
        public string ActionCode { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string ActorUsername { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string? Metadata { get; set; }
    }
}

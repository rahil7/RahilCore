namespace RahilCore.Domain.Entities
{
    public sealed class ActivityLogEn
    {
        public long Id { get; set; }
        public long OrderId { get; set; }
        public long? OrderItemId { get; set; }
        
        public long EntityTypeId { get; set; }
        public MasterParameterEn? EntityType { get; set; }

        public long? EntityId { get; set; }
        
        public long ActionCodeId { get; set; }
        public MasterParameterEn? ActionCode { get; set; }

        public string Description { get; set; } = null!;
        public string ActorUsername { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string? Metadata { get; set; }
    }
}

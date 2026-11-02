namespace RahilCore.Domain.Entities
{
    public sealed class CustomerEmailEn : BaseEntity
    {
        public long CustomerId { get; set; }
        public CustomerEn? Customer { get; set; }
        public string Email { get; set; } = null!;
        public bool IsPrimary { get; set; }
    }
}

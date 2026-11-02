namespace RahilCore.Domain.Entities
{
    public sealed class CustomerPhoneEn : BaseEntity
    {
        public long CustomerId { get; set; }
        public CustomerEn? Customer { get; set; }
        public string Phone { get; set; } = null!;
        public bool IsPrimary { get; set; }
    }
}

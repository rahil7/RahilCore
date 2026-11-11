using RahilCore.Domain.Entities.Common;

namespace RahilCore.Domain.Entities.Customers
{
    public sealed class CustomerEmailEn : BaseMasterEntity
    {
        public long CustomerId { get; set; }
        public CustomerEn? Customer { get; set; }
        public string Email { get; set; } = null!;
        public bool IsPrimary { get; set; }
    }
}

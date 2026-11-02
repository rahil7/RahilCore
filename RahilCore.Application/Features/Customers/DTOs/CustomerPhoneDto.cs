using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Customers.DTOs
{
    public sealed class CustomerPhoneDto : AuditableDto
    {
        public long CustomerId { get; set; }
        public string Phone { get; set; } = null!;
    }
}

using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Customers.DTOs
{
    public sealed class CustomerEmailDto : AuditableDto
    {
        public long CustomerId { get; set; }
        public string Email { get; set; } = null!;
    }
}

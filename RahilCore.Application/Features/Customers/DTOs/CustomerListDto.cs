using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Customers.DTOs
{
    public sealed class CustomerListDto : BaseMasterAuditDto
    {
        public string CustCode { get; set; } = string.Empty;
        public string CustName { get; set; } = string.Empty;

        public long CustType { get; set; }
        public string? CustTypeName { get; set; }

        public string? Email { get; set; }
        public string? Phone { get; set; }

        public long? CityId { get; set; }
        public string? CityName { get; set; }
    }
}

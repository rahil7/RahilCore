namespace RahilCore.Application.Features.Customers.DTOs
{
    public sealed class CustomerListDto
    {
        public long Id { get; set; }

        public string CustCode { get; set; } = string.Empty;
        public string CustName { get; set; } = string.Empty;

        public long CustType { get; set; }
        public string? CustTypeName { get; set; }

        public string? Email { get; set; }
        public string? Phone { get; set; }

        public long? CityId { get; set; }
        public string? CityName { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime LastActivityAt { get; set; }
        public string LastActivityBy { get; set; } = string.Empty;
        public string? LastActivityNote { get; set; }
    }
}

namespace RahilCore.Application.Features.Customers.DTOs
{
    public sealed class CustomerDetailDto
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

        public string? Address { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? CreatedNote { get; set; }

        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public string? UpdatedNote { get; set; }
    }
}

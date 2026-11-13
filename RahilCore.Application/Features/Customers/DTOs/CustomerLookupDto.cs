namespace RahilCore.Application.Features.Customers.DTOs
{
    public sealed class CustomerLookupDto
    {
        public long Id { get; set; }
        public string CustCode { get; set; } = string.Empty;
        public string CustName { get; set; } = string.Empty;
        public string? CustTypeName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
}

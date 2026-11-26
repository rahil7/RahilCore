namespace RahilCore.Application.Common.DTOs
{
    public class BaseCustomerDto
    {
        public string CustomerCode { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public long CustomerTypeId { get; set; }
        public string CustomerType { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}

namespace RahilCore.Domain.Entities
{
    public sealed class CustomerEn : BaseEntity
    {
        public long CustTypeId { get; set; }
        public MasterParameterEn? CustType { get; set; }
        public string CustCode { get; set; } = null!;
        public string CustName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public long? CityId { get; set; }
        public CityEn? City { get; set; }
        public string? Address { get; set; }
    }
}

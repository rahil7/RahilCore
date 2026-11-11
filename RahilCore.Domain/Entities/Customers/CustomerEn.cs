using RahilCore.Domain.Entities.Common;
using RahilCore.Domain.Entities.MasterData;

namespace RahilCore.Domain.Entities.Customers
{
    public sealed class CustomerEn : BaseMasterEntity
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

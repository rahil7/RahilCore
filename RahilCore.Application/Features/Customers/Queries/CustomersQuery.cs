using RahilCore.Application.Common.Querying;

namespace RahilCore.Application.Features.Customers.Queries
{
    public sealed class CustomersQuery : ListQuery
    {
        public List<bool>? Status { get; set; }

        public List<long>? CustTypeIds { get; set; }

        public List<long>? CityIds { get; set; }
    }
}

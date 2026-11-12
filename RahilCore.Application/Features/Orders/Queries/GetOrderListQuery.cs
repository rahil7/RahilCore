using RahilCore.Application.Common.Querying;

namespace RahilCore.Application.Features.Orders.Queries
{
    public sealed class GetOrderListQuery : ListQuery
    {
        public DateOnly? CreatedFrom { get; set; }

        public DateOnly? CreatedTo { get; set; }

        public List<bool>? Status { get; set; }

        public List<long>? CustTypeIds { get; set; }
    }
}

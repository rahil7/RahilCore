using RahilCore.Application.Features.Orders.DTOs;
using RahilCore.Application.Features.Orders.Queries;
using RahilCore.Domain.Entities.Inspections;

namespace RahilCore.Application.Features.Orders
{
    public interface IOrderRepository
    {
        Task<string> GenerateOrderNoAsync(CancellationToken ct = default);
        void AddItemRange(IEnumerable<InspectionOrderItemEn> items);
        void Add(InspectionOrderEn order);
        void Add(InspectionOrderItemEn orderItems);
        Task<(IReadOnlyList<OrderListDto> Items, int TotalItems)> GetPagedAsync(GetOrderListQuery query, CancellationToken ct = default);
    }
}

using RahilCore.Application.Features.Orders.DTOs;
using RahilCore.Application.Features.Orders.Queries;
using RahilCore.Domain.Entities.Orders;

namespace RahilCore.Application.Features.Orders
{
    public interface IOrderRepository
    {
        Task<string> GenerateOrderNoAsync(CancellationToken ct = default);
        void AddItemRange(IEnumerable<InspectionOrderItemEn> items);
        void Add(InspectionOrderEn order);
        void Add(InspectionOrderItemEn orderItems);
        Task<(IReadOnlyList<OrderListDto> Items, int TotalItems)> GetPagedAsync(GetOrderListQuery query, CancellationToken ct = default);
        Task<InspectionOrderEn?> GetByIdAsync(long id, CancellationToken ct = default);
        void AddPayment(InspectionOrderPaymentEn payment);
        Task<bool> ExistsPaymentAsync(long orderId, CancellationToken ct = default);
        Task<InspectionOrderPaymentEn?> GetPaymentByIdAsync(long paymentId, CancellationToken ct = default);
    }
}

using RahilCore.Application.Features.Orders.DTOs;
using RahilCore.Application.Features.Orders.Queries;
using RahilCore.Domain.Entities.Orders;

namespace RahilCore.Application.Features.Orders
{
    public interface IOrderRepository
    {
        Task<string> GenerateOrderNoAsync(long custType, CancellationToken ct = default);
        void AddItemRange(IEnumerable<InspectionOrderItemEn> items);
        void Add(InspectionOrderEn order);
        void Add(InspectionOrderItemEn orderItems);
        Task<(IReadOnlyList<OrderListDto> Items, int TotalItems)> GetPagedAsync(GetOrderListQuery query, CancellationToken ct = default);
        Task<InspectionOrderEn?> GetByIdAsync(long id, CancellationToken ct = default);
        void AddPayment(InspectionOrderPaymentEn payment);
        Task<bool> ExistsPaymentAsync(long orderId, CancellationToken ct = default);
        Task<InspectionOrderPaymentEn?> GetPaymentByIdAsync(long paymentId, CancellationToken ct = default);
        Task<bool> ExistsAssignment(long id, string inspectorUsername, CancellationToken ct = default);
        Task<InspectionOrderAssignmentEn?> GetActiveAssignment(long orderId, CancellationToken ct = default);
        Task<InspectionOrderAssignmentEn?> GetAssignment(long orderId, string inspectorUsername, CancellationToken ct = default);
        void AddAssignment(InspectionOrderAssignmentEn assignment);

        Task<bool> HasSubmittedInspectionAsync(long orderId, CancellationToken ct = default);
        Task<InspectionOrderItemEn?> GetOrderItemByOrderId(long orderId, CancellationToken ct = default);
        Task<string> GenerateInspectionNo(long custType, CancellationToken ct = default);
        Task<IReadOnlyList<InspectionOrderItemEn>> GetOrderDetailItems(long orderId, CancellationToken ct = default);
        Task<OrderPaymentDto?> GetOrderPayment(long orderId, CancellationToken ct = default);
        Task<OrderAssignmentDto?> GetOrderAssignment(long orderId, CancellationToken ct = default);
    }
}

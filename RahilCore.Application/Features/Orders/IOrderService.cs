using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Features.Orders.DTOs;
using RahilCore.Application.Features.Orders.Queries;
using RahilCore.Application.Features.Orders.Request;

namespace RahilCore.Application.Features.Orders
{
    public interface IOrderService
    {
        Task<long> Assign(long id, AssignOrderRequest request, string createdBy, CancellationToken ct);
        Task<long> CreateOrderForCustomer(CreateOrderCustomerRequest request, string createdBy, CancellationToken ct = default);
        Task<long> CreateOrderForDealer(CreateOrderDealerRequest request, string createdBy, CancellationToken ct = default);
        Task<long> CreatePayment(long id,CreatePaymentRequest request, string createdBy, CancellationToken ct = default);
        Task<OrderCreateOptions> GetCreateOptionsAsync(CancellationToken ct = default);
        Task<OrderFilterOptions> GetFilterOptionsAsync(CancellationToken ct = default);
        Task<(IReadOnlyList<OrderListDto> Items, int TotalItems)> GetPagedAsync(GetOrderListQuery query, CancellationToken ct = default);
        Task<OrderPaymentCreateOption?> GetPaymentOptionsAsync(CancellationToken ct = default);
        Task<FileAccessDto> GetPaymentProofAsync(long paymentId, CancellationToken ct = default);
    }
}

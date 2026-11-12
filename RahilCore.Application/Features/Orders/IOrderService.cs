using RahilCore.Application.Features.Orders.Request;

namespace RahilCore.Application.Features.Orders
{
    public interface IOrderService
    {
        Task<long> CreateOrderForCustomer(CreateOrderCustomerRequest request, string createdBy, CancellationToken ct = default);
        Task<long> CreateOrderForDealer(CreateOrderDealerRequest request, string createdBy, CancellationToken ct = default);
    }
}

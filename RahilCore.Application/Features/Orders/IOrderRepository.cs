using RahilCore.Domain.Entities.Inspections;

namespace RahilCore.Application.Features.Orders
{
    public interface IOrderRepository
    {
        Task<string> GenerateOrderNoAsync(CancellationToken ct = default);

        void AddItemRange(IEnumerable<InspectionOrderItemEn> items);
        void Add(InspectionOrderEn order);
    }
}

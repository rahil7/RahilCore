using RahilCore.Application.Features.Orders.DTOs;
using RahilCore.Domain.Entities;

namespace RahilCore.Application.Features
{
    public interface IActivityRepository
    {
        void Add(ActivityLogEn activity);
        Task<IReadOnlyList<OrderActivityDto>> GetByOrderIdAsync(long orderId, CancellationToken ct=default);
    }
}

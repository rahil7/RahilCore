using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Common.Constants;
using RahilCore.Application.Features;
using RahilCore.Application.Features.Orders.DTOs;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.DbContext;

namespace RahilCore.Infrastructure.Persistence.Repositories
{
    public sealed class ActivityRepository(RahilCoreDbContext context) : IActivityRepository
    {
        public void Add(ActivityLogEn activity)
        {
            context.ActivityLogs.Add(activity);
        }

        public async Task<IReadOnlyList<OrderActivityDto>> GetByOrderIdAsync(long orderId, CancellationToken ct)
        {
           return await context.ActivityLogs
                .AsNoTracking()
                .Where(x => x.OrderId == orderId)
                .Select(x => new OrderActivityDto
                {
                    Id = x.Id,
                    Action = x.ActionCode!.ParamName!,
                    Type = x.EntityType!.ParamName!,
                    Description = x.Description,
                    CreatedAt = x.CreatedAt,
                    CreatedBy = x.ActorUsername
                })
                .OrderBy(x => x.CreatedAt)
                .ToListAsync(ct);
        }
    }
}

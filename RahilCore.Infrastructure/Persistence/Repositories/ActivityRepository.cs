using RahilCore.Application.Features;
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
    }
}

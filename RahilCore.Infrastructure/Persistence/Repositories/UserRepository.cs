using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Abstractions.Persistence;
using RahilCore.Application.Common.Constants;
using RahilCore.Domain.Entities;
using RahilCore.Infrastructure.Persistence.DbContext;

namespace RahilCore.Infrastructure.Persistence.Repositories
{
    public sealed class UserRepository(RahilCoreDbContext context) : IUserRepository
    {
        public async Task AddAsync(UserEn user, CancellationToken ct = default)
        {
            await context.Users.AddAsync(user, ct);
        }

        public Task<UserEn?> GetByUsernameNormalizedAsync(string usernameNormalized, long userLevelId, CancellationToken ct = default)
        {
            return context.Users.SingleOrDefaultAsync(x => 
                x.UsernameNormalized == usernameNormalized && 
                x.UserLevelId==userLevelId, 
                ct);
        }

        public Task<UserEn?> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            return context.Users.SingleOrDefaultAsync(x => x.Id == id,ct);
        }

        public Task<bool> HasAnyAsync(CancellationToken ct = default)
        {
            return context.Users.AnyAsync(ct);
        }

        public async Task SaveChangesAsync(CancellationToken ct = default)
        {
            await context.SaveChangesAsync(ct);
        } 

        public Task<UserEn?> GetByUsernameAsync(string username, CancellationToken ct = default)
        {
            return context.Users
                .Include(x => x.UserLevel)
                .SingleOrDefaultAsync(
                    x => x.UsernameNormalized == username,
                    ct);
        }

        public async Task<bool> ExistsInspector(string username, CancellationToken ct = default)
        {
            return await context.Users.AnyAsync(x => x.UserLevelId == UserLevel.INSPECTOR && x.Username == username, ct);
        }
    }
}

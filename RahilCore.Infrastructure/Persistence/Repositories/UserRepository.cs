using Microsoft.EntityFrameworkCore;
using RahilCore.Application.Abstractions.Persistence;
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

        public Task<UserEn?> GetByUsernameNormalizedAsync(string usernameNormalized, CancellationToken ct = default)
        {
            return context.Users.SingleOrDefaultAsync(x => x.UsernameNormalized == usernameNormalized, ct);
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
    }
}

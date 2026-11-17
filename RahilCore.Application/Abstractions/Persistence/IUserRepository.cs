using RahilCore.Domain.Entities;

namespace RahilCore.Application.Abstractions.Persistence
{
    public interface IUserRepository
    {
        Task<UserEn?> GetByUsernameNormalizedAsync(string usernameNormalized, long userLevelId,CancellationToken cancellationToken = default);
        
        Task<UserEn?> GetByUsernameAsync(string username, CancellationToken ct = default);

        Task<bool> HasAnyAsync(CancellationToken ct = default);

        Task<bool> ExistsInspector(string username, CancellationToken ct = default);

        Task<UserEn?> GetByIdAsync(Guid id,CancellationToken cancellationToken = default);

        Task AddAsync(UserEn user,CancellationToken cancellationToken = default);

        Task SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}

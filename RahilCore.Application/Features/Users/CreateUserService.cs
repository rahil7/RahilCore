using RahilCore.Application.Abstractions.Persistence;
using RahilCore.Application.Common.Exceptions;
using RahilCore.Application.Features.MasterParameters;
using RahilCore.Domain.Entities;

namespace RahilCore.Application.Features.Users
{
    public sealed class CreateUserService(
        IUserRepository userRepository,
        IPasswordHasherService passwordHasher,
        IMasterParameterRepository masterParameterRepo)
    {
        public async Task<CreateUserResult> ExecuteAsync(
            string username,
            string password,
            long userLevelId,
            string displayName,
            CancellationToken ct = default)
        {
            if (!await masterParameterRepo.ExistsAsync(userLevelId, MasterParameterTypes.USER_LEVEL, ct))
            {
                throw new BusinessException(400, "Level tidak valid.");
            }

            var normalizedUsername = username.Trim().ToUpperInvariant();

            var existingUser = await userRepository.GetByUsernameNormalizedAsync(normalizedUsername, ct);

            if (existingUser is not null)
            {
                throw new InvalidOperationException("Username sudah terdaftar.");
            }

            var user = new UserEn
            {
                Username = username.Trim(),
                UserLevelId = userLevelId,
                UsernameNormalized = normalizedUsername,
                PasswordHash = passwordHasher.HashPassword(password),
                DisplayName = displayName.Trim(),
                IsActive = true,
                CreatedAtUtc = DateTime.UtcNow
            };

            await userRepository.AddAsync(user, ct);
            await userRepository.SaveChangesAsync(ct);

            return new CreateUserResult(
                user.Id,
                user.Username,
                user.UserLevel != null && user.UserLevel.ParamName != null ? user.UserLevel.ParamName : "-",
                user.DisplayName,
                user.CreatedAtUtc);
        }
    }
}

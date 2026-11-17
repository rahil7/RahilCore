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
            var userLevel = await masterParameterRepo.GetByIdAsync(
                userLevelId,
                MasterParameterTypes.USER_LEVEL,
                ct);

            if (userLevel is null)
            {
                throw new BusinessException(400, "Level tidak valid.");
            }

            var prefix = userLevel.ParamValue;

            if (string.IsNullOrWhiteSpace(prefix))
            {
                throw new BusinessException(400, "Prefix user level belum tersedia.");
            }

            var finalUsername = $"{prefix.Trim().ToLowerInvariant()}.{username.Trim()}";
            var normalizedUsername = finalUsername.ToUpperInvariant();

            var existingUser = await userRepository.GetByUsernameNormalizedAsync(
                normalizedUsername, 
                userLevelId, 
                ct);

            if (existingUser is not null)
            {
                throw new InvalidOperationException("Username dengan level ini sudah terdaftar.");
            }

            var user = new UserEn
            {
                Username = finalUsername,
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
                userLevel.ParamName ?? "-",
                user.DisplayName,
                user.CreatedAtUtc);
        }
    }
}

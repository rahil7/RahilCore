using RahilCore.Application.Abstractions.Persistence;
using RahilCore.Domain.Entities;

namespace RahilCore.Application.Features.Users
{
    public sealed class CreateUserService(
        IUserRepository userRepository,
        IPasswordHasherService passwordHasher)
    {
        public async Task<CreateUserResult> ExecuteAsync(
            string username,
            string password,
            string displayName,
            CancellationToken ct = default)
        {
            var normalizedUsername = username.Trim().ToUpperInvariant();

            if (await userRepository.HasAnyAsync(ct))
            {
                throw new InvalidOperationException(
                    "UserEn sudah tersedia. Pembuatan user pertama telah ditutup.");
            }

            var existingUser = await userRepository
                .GetByUsernameNormalizedAsync(normalizedUsername, ct);

            if (existingUser is not null)
            {
                throw new InvalidOperationException("Username sudah terdaftar.");
            }

            var user = new UserEn
            {
                Username = username.Trim(),
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
                user.DisplayName,
                user.CreatedAtUtc);
        }
    }
}

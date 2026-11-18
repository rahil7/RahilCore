using RahilCore.Application.Abstractions.Persistence;
using RahilCore.Application.Features.Users;

namespace RahilCore.Application.Features.Auth
{
    public sealed class AuthService(
        IUserRepository userRepository,
        IPasswordHasherService passwordHasher)
    {
        public async Task<LoginResult?> LoginAsync(string username, string password,CancellationToken ct = default)
        {
            var normalizedUsername = username.Trim().ToUpperInvariant();

            var user = await userRepository.GetByUsernameAsync(normalizedUsername, ct);

            if (user is null || !user.IsActive)
                return null;

            var isValid = passwordHasher.VerifyPassword(password, user.PasswordHash);

            if (!isValid)
                return null;

            return new LoginResult(user.Id, user.Username, user.UserLevel!.ParamCode, user.DisplayName);
        }
    }
}

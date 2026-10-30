using Microsoft.AspNetCore.Identity;
using RahilCore.Application.Abstractions.Persistence;
using RahilCore.Domain.Entities;

namespace RahilCore.Infrastructure.Security
{
    public sealed class PasswordHasherService : IPasswordHasherService
    {
        private readonly PasswordHasher<UserEn> _hasher = new();
        public string HashPassword(string password)
        {
            var user = new UserEn();

            return _hasher.HashPassword(user, password);
        }

        public bool VerifyPassword(string password, string passwordHash)
        {
            var user = new UserEn();

            var result = _hasher.VerifyHashedPassword(user,passwordHash,password);

            return result != PasswordVerificationResult.Failed;
        }
    }
}

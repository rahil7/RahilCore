using Microsoft.AspNetCore.Identity;
using RahilCore.Domain.Entities;

namespace RahilCore.Server.Utilities
{
    public static class PasswordHashGenerator
    {
        public static string Generate(string password)
        {
            var hasher = new PasswordHasher<UserEn>();
            return hasher.HashPassword(new UserEn(), password);
        }
    }
}

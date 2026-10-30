namespace RahilCore.Application.Abstractions.Persistence
{
    public interface IPasswordHasherService
    {
        string HashPassword(string password);

        bool VerifyPassword(string password, string passwordHash);
    }
}

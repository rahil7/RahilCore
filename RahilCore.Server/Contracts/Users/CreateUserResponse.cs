namespace RahilCore.Server.Contracts.Users
{
    public sealed record CreateUserResponse(
        Guid Id,
        string Username,
        string DisplayName,
        DateTime CreatedAtUtc
    );
}

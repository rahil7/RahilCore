namespace RahilCore.Application.Features.Users
{
    public sealed record CreateUserResult(
        Guid Id,
        string Username,
        string UserLevel,
        string DisplayName,
        DateTime CreatedAtUtc);
}

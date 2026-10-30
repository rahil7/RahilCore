namespace RahilCore.Application.Features.Auth
{
    public sealed record LoginResult(
        Guid UserId,
        string Username,
        string DisplayName
    );
}

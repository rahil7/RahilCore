namespace RahilCore.Server.Contracts.Auth
{
    public sealed record AuthResponse(
        Guid Id,
        string Username,
        string UserLevel,
        string DisplayName
    );
}

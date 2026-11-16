using System.Globalization;

namespace RahilCore.Application.Features.Auth
{
    public sealed record LoginResult(
        Guid UserId,
        string Username,
        string UserLevel,
        string DisplayName
    );
}

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RahilCore.Application.Features.Auth;
using RahilCore.Server.Contracts.Auth;
using RahilCore.Server.Contracts.Common;
using System.Security.Claims;

namespace RahilCore.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public sealed class AuthController(AuthService authService) : ControllerBase
    {
        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Login(
            [FromBody] LoginRequest request,
            CancellationToken ct)
        {
            var result = await authService.LoginAsync(
                request.Username,
                request.Password,
                ct);

            if (result is null)
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        false,
                        "Username atau password tidak valid.",
                        null));
            }

            var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, result.UserId.ToString()),
            new(ClaimTypes.Name, result.DisplayName),
            new("username", result.Username)
        };

            var identity = new ClaimsIdentity(
                claims,
                CookieAuthenticationDefaults.AuthenticationScheme);

            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal);

            var response = new AuthResponse(
                result.UserId,
                result.Username,
                result.DisplayName);

            return Ok(
                new ApiResponse<AuthResponse>(
                    true,
                    "Login berhasil.",
                    response));
        }

        [Authorize]
        [HttpGet("me")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public ActionResult<ApiResponse<AuthResponse>> Me()
        {
            var idValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(idValue, out var userId))
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        false,
                        "Sesi tidak valid.",
                        null));
            }

            var username = User.FindFirstValue("username");
            var displayName = User.FindFirstValue(ClaimTypes.Name);

            if (string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(displayName))
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        false,
                        "Data sesi tidak lengkap.",
                        null));
            }

            return Ok(
                new ApiResponse<AuthResponse>(
                    true,
                    "Sesi valid.",
                    new AuthResponse(userId, username, displayName)));
        }

        [Authorize]
        [HttpPost("logout")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<object>>> Logout()
        {
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);

            return Ok(
                new ApiResponse<object>(
                    true,
                    "Logout berhasil.",
                    null));
        }
    }
}

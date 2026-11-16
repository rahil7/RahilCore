using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RahilCore.Application.Features.Users;
using RahilCore.Server.Contracts.Common;
using RahilCore.Server.Contracts.Users;
using System.Security.Claims;

namespace RahilCore.Server.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController(CreateUserService createUserService) : ControllerBase
    {
        [HttpPost]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<CreateUserResponse>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
        public async Task<ActionResult<CreateUserResponse>> Create([FromBody] CreateUserRequest request,CancellationToken ct)
        {
            var username = User.FindFirstValue("username");
            var userlevel = User.FindFirstValue("userlevel");

            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        Success: false,
                        Message: "User identity not found.",
                        Data: null));
            }

            if (!string.Equals(userlevel?.Trim(), "sa", StringComparison.OrdinalIgnoreCase))
            {
                return Forbid();
            }

            try
            {
                var result = await createUserService.ExecuteAsync(
                    request.Username,
                    request.Password,
                    request.UserLevelId,
                    request.DisplayName,
                    ct);

                var response = new CreateUserResponse(
                    result.Id,
                    result.Username,
                    result.DisplayName,
                    result.CreatedAtUtc);

                return StatusCode(
                    StatusCodes.Status201Created,
                    new ApiResponse<CreateUserResponse>(true,"User berhasil dibuat.",response));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new ApiResponse<object>(false,ex.Message,null));
            }
        }
    }
}

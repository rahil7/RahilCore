using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RahilCore.Application.Features.Orders;
using RahilCore.Application.Features.Orders.Request;
using RahilCore.Server.Contracts.Common;
using System.Security.Claims;

namespace RahilCore.Server.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("create-dealer")]
        public async Task<IActionResult> CreateOrderForDealer([FromBody] CreateOrderDealerRequest request, CancellationToken ct)
        {
            var createdBy = User.FindFirstValue("username");

            if (string.IsNullOrWhiteSpace(createdBy))
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        Success: false,
                        Message: "User identity not found.",
                        Data: null));
            }

            long id = await _orderService.CreateOrderForDealer(request, createdBy, ct);

            return StatusCode(
                StatusCodes.Status201Created,
                new ApiResponse<object>(
                    Success: true,
                    Message: "Order created successfully.",
                    Data: new { Id = id }));
        }
    }
}

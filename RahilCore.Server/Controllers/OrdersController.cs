using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RahilCore.Application.Features.Orders;
using RahilCore.Application.Features.Orders.DTOs;
using RahilCore.Application.Features.Orders.Queries;
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

        [HttpPost("create-customer")]
        public async Task<IActionResult> CreateOrderForCustomer([FromBody] CreateOrderCustomerRequest request, CancellationToken ct)
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

            long id = await _orderService.CreateOrderForCustomer(request, createdBy, ct);

            return StatusCode(
                StatusCodes.Status201Created,
                new ApiResponse<object>(
                    Success: true,
                    Message: "Order created successfully.",
                    Data: new { Id = id }));
        }

        [HttpGet("filter-options")]
        public async Task<ActionResult<ApiResponse<OrderFilterOptions>>> GetFilterOptions(CancellationToken ct)
        {
            var options = await _orderService.GetFilterOptionsAsync(ct);

            return Ok(
                new ApiResponse<OrderFilterOptions>(
                    Success: true,
                    Message: "Order filter options retrieved successfully.",
                    Data: options));
        }

        [HttpGet("create-options")]
        public async Task<ActionResult<ApiResponse<OrderCreateOptions>>> GetCreateOptions(CancellationToken ct)
        {
            var options = await _orderService.GetCreateOptionsAsync(ct);

            return Ok(
                new ApiResponse<OrderCreateOptions>(
                    Success: true,
                    Message: "Create order options retrieved successfully.",
                    Data: options));
        }

        [HttpGet]
        public async Task<ActionResult<PagedResponse<OrderListDto>>> GetPaged([FromQuery] GetOrderListQuery query, CancellationToken ct)
        {
            var (items, totalItems) = await _orderService.GetPagedAsync(query, ct);

            var totalPages = (int)Math.Ceiling(
                totalItems / (double)query.PageSize);

            var response = new PagedResponse<OrderListDto>(
                Success: true,
                Message: "Orders retrieved successfully.",
                Data: items,
                Pagination: new PaginationMetadata(
                    Page: query.Page,
                    PageSize: query.PageSize,
                    TotalItems: totalItems,
                    TotalPages: totalPages));

            return Ok(response);
        }
    }
}

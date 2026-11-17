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
    public class OrdersController(IOrderService orderService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<PagedResponse<OrderListDto>>> GetPaged([FromQuery] GetOrderListQuery query, CancellationToken ct)
        {
            var (items, totalItems) = await orderService.GetPagedAsync(query, ct);

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

        [HttpGet("filter-options")]
        public async Task<ActionResult<ApiResponse<OrderFilterOptions>>> GetFilterOptions(CancellationToken ct)
        {
            var options = await orderService.GetFilterOptionsAsync(ct);

            return Ok(
                new ApiResponse<OrderFilterOptions>(
                    Success: true,
                    Message: "Order filter options retrieved successfully.",
                    Data: options));
        }

        [HttpGet("create-options")]
        public async Task<ActionResult<ApiResponse<OrderCreateOptions>>> GetCreateOptions(CancellationToken ct)
        {
            var options = await orderService.GetCreateOptionsAsync(ct);

            return Ok(
                new ApiResponse<OrderCreateOptions>(
                    Success: true,
                    Message: "Create order options retrieved successfully.",
                    Data: options));
        }

        [HttpPost("create-dealer")]
        public async Task<IActionResult> CreateOrderDealer([FromBody] CreateOrderDealerRequest request, CancellationToken ct)
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

            long id = await orderService.CreateOrderForDealer(request, createdBy, ct);

            return StatusCode(
                StatusCodes.Status201Created,
                new ApiResponse<object>(
                    Success: true,
                    Message: "Order created successfully.",
                    Data: new { Id = id }));
        }

        [HttpPost("create-customer")]
        public async Task<IActionResult> CreateOrderCustomer([FromBody] CreateOrderCustomerRequest request, CancellationToken ct)
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

            long id = await orderService.CreateOrderForCustomer(request, createdBy, ct);

            return StatusCode(
                StatusCodes.Status201Created,
                new ApiResponse<object>(
                    Success: true,
                    Message: "Order created successfully.",
                    Data: new { Id = id }));
        }

        [HttpPost("{id:long}/payments")]
        public async Task<IActionResult> CreatePayment([FromRoute] long id, [FromForm] CreatePaymentRequest request, CancellationToken ct)
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

            long resultId = await orderService.CreatePayment(id, request, createdBy, ct);

            return StatusCode(
                StatusCodes.Status201Created,
                new ApiResponse<object>(
                    Success: true,
                    Message: "Payment created successfully.",
                    Data: new { Id = id }));
        }

        [HttpGet("payments/{paymentId:long}/proof")]
        public async Task<IActionResult> GetPaymentProof([FromRoute] long paymentId,CancellationToken ct)
        {
            var payment = await orderService.GetPaymentProofAsync(paymentId, ct);

            return Ok(payment);
        }

        [HttpPost("{id:long}/assign")]
        public async Task<IActionResult> Assign([FromRoute] long id,[FromBody] AssignOrderRequest request,CancellationToken ct)
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

            long resultId = await orderService.Assign(id, request, createdBy, ct);

            return StatusCode(
                StatusCodes.Status201Created,
                new ApiResponse<object>(
                    Success: true,
                    Message: "Order assigned successfully.",
                    Data: new { Id = id }));
        }
    }
}

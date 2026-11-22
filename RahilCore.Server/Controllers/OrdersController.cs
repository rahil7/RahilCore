using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RahilCore.Application.Common.DTOs;
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

        [HttpGet("{id:long}")]
        public async Task<ActionResult<ApiResponse<OrderDetailDto>>> GetById(long id, CancellationToken ct)
        {
            var order = await orderService.GetByIdAsync(id, ct);

            if (order is null)
            {
                return NotFound(
                    new ApiResponse<OrderDetailDto>(
                        Success: false,
                        Message: "Order tidak ditemukan.",
                        Data: null));
            }

            return Ok(
                new ApiResponse<OrderDetailDto>(
                    Success: true,
                    Message: "Customer retrieved successfully.",
                    Data: order));
        }

        [HttpPut("{id:long}")]
        public async Task<ActionResult> Update([FromRoute] long id, [FromBody] UpdateOrderRequest request, CancellationToken ct)
        {
            var username = User.FindFirstValue("username");

            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        Success: false,
                        Message: "User identity not found.",
                        Data: null));
            }

            await orderService.Update(id, request, username, ct);

            return Ok(
                new ApiResponse<object>(
                    Success: true,
                    Message: "Order berhasi di update.",
                    Data: null));
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

        [HttpGet("payment-options")]
        public async Task<ActionResult<ApiResponse<OrderPaymentCreateOption>>> GetPaymentOptions(CancellationToken ct)
        {
            var options = await orderService.GetPaymentOptionsAsync(ct);

            return Ok(
                new ApiResponse<OrderPaymentCreateOption>(
                    Success: true,
                    Message: "Payemt options retrieved successfully.",
                    Data: options));
        }

        [HttpGet("assign-options")]
        public async Task<ActionResult<ApiResponse<OrderAssignOption>>> GetAssignOptions(CancellationToken ct)
        {
            var options = await orderService.GetAssignOptionsAsync(ct);

            return Ok(
                new ApiResponse<OrderAssignOption>(
                    Success: true,
                    Message: "Payemt options retrieved successfully.",
                    Data: options));
        }

        [HttpPost("create-dealer")]
        public async Task<IActionResult> CreateOrderDealer([FromBody] CreateOrderDealerRequest request, CancellationToken ct)
        {
            var username = User.FindFirstValue("username");

            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        Success: false,
                        Message: "User identity not found.",
                        Data: null));
            }

            long id = await orderService.CreateOrderForDealer(request, username, ct);

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
            var username = User.FindFirstValue("username");

            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        Success: false,
                        Message: "User identity not found.",
                        Data: null));
            }

            long id = await orderService.CreateOrderForCustomer(request, username, ct);

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
            var username = User.FindFirstValue("username");

            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        Success: false,
                        Message: "User identity not found.",
                        Data: null));
            }

            long resultId = await orderService.CreatePayment(id, request, username, ct);

            return StatusCode(
                StatusCodes.Status201Created,
                new ApiResponse<object>(
                    Success: true,
                    Message: "Payment created successfully.",
                    Data: new { Id = id }));
        }

        [HttpPatch("{id:long}/payments/{paymentId:long}")]
        public async Task<IActionResult> UpdatePayment([FromRoute] long id, [FromRoute] long paymentId, [FromForm] UpdatePaymentRequest request,CancellationToken ct)
        {
            var username = User.FindFirstValue("username");

            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        Success: false,
                        Message: "User identity not found.",
                        Data: null));
            }

            long resultId = await orderService.UpdatePayment(id, paymentId, request, username, ct);

            return StatusCode(
                StatusCodes.Status201Created,
                new ApiResponse<object>(
                    Success: true,
                    Message: "Payment update successfully.",
                    Data: new { Id = id }));
        }

        [HttpGet("payments/{paymentId:long}/proof")]
        public async Task<IActionResult> GetPaymentProof([FromRoute] long paymentId,CancellationToken ct)
        {
            FileAccessDto payment = await orderService.GetPaymentProofAsync(paymentId, ct);

            return Ok(payment);
        }

        [HttpPost("{id:long}/assign")]
        public async Task<IActionResult> Assign([FromRoute] long id,[FromBody] OrderAssignRequest request,CancellationToken ct)
        {
            var username = User.FindFirstValue("username");

            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        Success: false,
                        Message: "User identity not found.",
                        Data: null));
            }

            long resultId = await orderService.Assign(id, request, username, ct);

            return StatusCode(
                StatusCodes.Status201Created,
                new ApiResponse<object>(
                    Success: true,
                    Message: "Order assigned successfully.",
                    Data: new { Id = id }));
        }

        [HttpDelete("{id:long}/items/{itemId:long}")]
        public async Task<IActionResult> DeleteOrderItem(
            [FromRoute] long id,
            [FromRoute] long itemId,
            [FromBody] DeleteOrderItemRequest request,
            CancellationToken ct)
        {
            var username = User.FindFirstValue("username");

            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        Success: false,
                        Message: "User identity not found.",
                        Data: null));
            }

            await orderService.DeleteOrderItem(id, itemId, request, username, ct);

            return Ok(
                new ApiResponse<object>(
                    Success: true,
                    Message: "Unit deleted successfully.",
                    Data: null));
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RahilCore.Application.Features.Customers;
using RahilCore.Application.Features.Customers.DTOs;
using RahilCore.Application.Features.Customers.Queries;
using RahilCore.Application.Features.Customers.Requests;
using RahilCore.Server.Contracts.Common;
using System.Security.Claims;

namespace RahilCore.Server.Controllers
{
    [ApiController]
    [Route("api/customers")]
    [Authorize]
    public sealed class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomersController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResponse<CustomerListDto>>> GetPaged([FromQuery] GetCustomersQuery query,CancellationToken ct)
        {
            var (items, totalItems) = await _customerService.GetPagedAsync(query, ct);

            var totalPages = (int)Math.Ceiling(
                totalItems / (double)query.PageSize);

            var response = new PagedResponse<CustomerListDto>(
                Success: true,
                Message: "Customers retrieved successfully.",
                Data: items,
                Pagination: new PaginationMetadata(
                    Page: query.Page,
                    PageSize: query.PageSize,
                    TotalItems: totalItems,
                    TotalPages: totalPages));

            return Ok(response);
        }

        [HttpGet("lookup")]
        public async Task<ActionResult<PagedResponse<CustomerLookupDto>>> GetPagedLookup([FromQuery] GetCustomersQuery query, CancellationToken ct)
        {
            var (items, totalItems) = await _customerService.GetPagedLookupAsync(query, ct);

            var totalPages = (int)Math.Ceiling(
                totalItems / (double)query.PageSize);

            var response = new PagedResponse<CustomerLookupDto>(
                Success: true,
                Message: "Customers retrieved successfully.",
                Data: items,
                Pagination: new PaginationMetadata(
                    Page: query.Page,
                    PageSize: query.PageSize,
                    TotalItems: totalItems,
                    TotalPages: totalPages));

            return Ok(response);
        }


        [HttpGet("{id:long}")]
        public async Task<ActionResult<ApiResponse<CustomerDetailDto>>> GetById(long id, CancellationToken ct)
        {
            var customer = await _customerService.GetByIdAsync(id, ct);

            if (customer is null)
            {
                return NotFound(
                    new ApiResponse<CustomerDetailDto>(
                        Success: false,
                        Message: "Customer tidak ditemukan.",
                        Data: null));
            }

            return Ok(
                new ApiResponse<CustomerDetailDto>(
                    Success: true,
                    Message: "Customer retrieved successfully.",
                    Data: customer));
        }

        [HttpGet("{id:long}/emails")]
        public async Task<ActionResult<ApiResponse<List<CustomerEmailDto>>>> GetCustomerEmails(long id, CancellationToken ct)
        {
            var customerEmails = await _customerService.GetCustomerEmails(id, ct);

            if (customerEmails is null)
            {
                return NotFound(
                    new ApiResponse<List<CustomerEmailDto>>(
                        Success: false,
                        Message: "Customer tidak ditemukan.",
                        Data: null));
            }

            return Ok(
                new ApiResponse<List<CustomerEmailDto>>(
                    Success: true,
                    Message: "Customer retrieved successfully.",
                    Data: customerEmails));
        }

        [HttpGet("{id:long}/phones")]
        public async Task<ActionResult<ApiResponse<List<CustomerPhoneDto>>>> GetCustomerPhones(long id, CancellationToken ct)
        {
            var customerPhones = await _customerService.GetCustomerPhones(id, ct);

            if (customerPhones is null)
            {
                return NotFound(
                    new ApiResponse<List<CustomerPhoneDto>>(
                        Success: false,
                        Message: "Customer tidak ditemukan.",
                        Data: null));
            }

            return Ok(
                new ApiResponse<List<CustomerPhoneDto>>(
                    Success: true,
                    Message: "Customer retrieved successfully.",
                    Data: customerPhones));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<object>>> Create([FromBody] CreateCustomerRequest request,CancellationToken ct)
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

            var id = await _customerService.CreateAsync(request,createdBy,ct);

            return StatusCode(
                StatusCodes.Status201Created,
                new ApiResponse<object>(
                    Success: true,
                    Message: "Customer created successfully.",
                    Data: new { Id = id }));
        }

        [HttpPatch("{id:long}")]
        public async Task<ActionResult<ApiResponse<object>>> Update(long id,[FromBody] UpdateCustomerRequest request,CancellationToken ct)
        {
            var updatedBy = User.FindFirstValue("username");

            if (string.IsNullOrWhiteSpace(updatedBy))
            {
                return Unauthorized(
                    new ApiResponse<object>(
                        Success: false,
                        Message: "User identity not found.",
                        Data: null));
            }

            await _customerService.UpdateAsync(id,request,updatedBy,ct);

            return Ok(
                new ApiResponse<object>(
                    Success: true,
                    Message: "Customer updated successfully.",
                    Data: null));
        }

        [HttpGet("filter-options")]
        public async Task<ActionResult<ApiResponse<CustomerFilterOptions>>>GetFilterOptions(CancellationToken ct)
        {
            CustomerFilterOptions options = await _customerService.GetFilterOptionsAsync(ct);

            return Ok(
                new ApiResponse<CustomerFilterOptions>(
                    Success: true,
                    Message: "Customer filter options retrieved successfully.",
                    Data: options));
        }
    }
}

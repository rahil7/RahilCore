using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RahilCore.Application.Features.Inspections;
using RahilCore.Application.Features.Inspections.DTOs;
using RahilCore.Application.Features.Inspections.Queries;
using RahilCore.Server.Contracts.Common;

namespace RahilCore.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InspectionsController(IInspectionService inspectionService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<PagedResponse<InspectionListDto>>> GetPaged([FromQuery] InspectionListQuery query, CancellationToken ct)
        {
            var (items, totalItems) = await inspectionService.GetPagedAsync(query, ct);

            var totalPages = (int)Math.Ceiling(
                totalItems / (double)query.PageSize);

            var response = new PagedResponse<InspectionListDto>(
                Success: true,
                Message: "Inspections retrieved successfully.",
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

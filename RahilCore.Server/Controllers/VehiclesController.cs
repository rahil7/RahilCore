using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Features.Vehicles;
using RahilCore.Server.Contracts.Common;

namespace RahilCore.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VehiclesController(IVehicleService vehicleService) : ControllerBase
    {

        [HttpGet("brands/{brandId:long}/models/lookup")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<FilterOptionDto>>>> GetModelLookup([FromRoute] long brandId,CancellationToken ct)
        {
            var options = await vehicleService.GetModelLookup(brandId, ct);

            return Ok(new ApiResponse<IReadOnlyList<FilterOptionDto>>(
                Success: true,
                Message: "Models retrieved successfully.",
                Data: options));
        }

        [HttpGet("models/{modelId:long}/variants/lookup")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<FilterOptionDto>>>> GetVariantLookup([FromRoute] long modelId,CancellationToken ct)
        {
            var options = await vehicleService.GetVariantLookup(modelId, ct);

            return Ok(new ApiResponse<IReadOnlyList<FilterOptionDto>>(
                Success: true,
                Message: "Variants retrieved successfully.",
                Data: options));
        }
    }
}

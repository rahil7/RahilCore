using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Features.Orders.DTOs;
using RahilCore.Application.Features.Vehicles;
using RahilCore.Server.Contracts.Common;

namespace RahilCore.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehiclesController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        [HttpGet("brands/{brandId:long}/models/lookup")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<FilterOptionDto>>>> GetModelLookup([FromRoute] long brandId,CancellationToken ct)
        {
            var options = await _vehicleService.GetModelLookup(brandId, ct);

            return Ok(new ApiResponse<IReadOnlyList<FilterOptionDto>>(
                Success: true,
                Message: "Models retrieved successfully.",
                Data: options));
        }

        [HttpGet("models/{modelId:long}/variants/lookup")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<FilterOptionDto>>>> GetVariantLookup([FromRoute] long modelId,CancellationToken ct)
        {
            var options = await _vehicleService.GetVariantLookup(modelId, ct);

            return Ok(new ApiResponse<IReadOnlyList<FilterOptionDto>>(
                Success: true,
                Message: "Variants retrieved successfully.",
                Data: options));
        }
    }
}

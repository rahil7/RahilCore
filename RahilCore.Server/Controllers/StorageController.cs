using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RahilCore.Application.Abstractions.Storage;

namespace RahilCore.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public sealed class StorageController(IObjectStorageService storageService) : ControllerBase
    {
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file,CancellationToken ct)
        {
            var objectKey = $"test/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            await using var stream = file.OpenReadStream();

            await storageService.UploadAsync(
                stream,
                objectKey,
                file.ContentType,
                ct);

            return Ok(new
            {
                ObjectKey = objectKey
            });
        }

        [HttpGet("get")]
        public async Task<IActionResult> Get([FromQuery] string objectKey)
        {
            var url = await storageService.GetPresignedUrlAsync(objectKey, 1);

            return Ok(new { Url = url });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] string objectKey,CancellationToken ct)
        {
            await storageService.DeleteAsync(objectKey, ct);

            return Ok(new { Message = "File deleted successfully." });
        }
    }
}

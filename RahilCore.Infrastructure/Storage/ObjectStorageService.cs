using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using RahilCore.Application.Abstractions.Storage;
using RahilCore.Infrastructure.Storage.Configurations;

namespace RahilCore.Infrastructure.Storage
{
    public sealed class ObjectStorageService(
            IAmazonS3 s3Client,
            IOptions<ObjectStorageOptions> options
        ) : IObjectStorageService
    {
        private readonly IAmazonS3 _s3Client = s3Client;
        private readonly ObjectStorageOptions _options = options.Value;

        public Task<string> GetPresignedUrlAsync(string objectKey,int expiryMinutes = 15)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _options.BucketName,
                Key = objectKey,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(expiryMinutes)
            };

            return _s3Client.GetPreSignedURLAsync(request);
        }

        public async Task DeleteAsync(string objectKey, CancellationToken ct = default)
        {
            var request = new DeleteObjectRequest
            {
                BucketName = _options.BucketName,
                Key = objectKey
            };

            await _s3Client.DeleteObjectAsync(request, ct);
        }

        public async Task UploadAsync(Stream fileStream, string objectKey, string contentType, CancellationToken ct = default)
        {
            var request = new PutObjectRequest
            {
                BucketName = _options.BucketName,
                Key = objectKey,
                InputStream = fileStream,
                ContentType = contentType,
                AutoCloseStream = false
            };

            try
            {
                await _s3Client.PutObjectAsync(request, ct);
            }
            catch (AmazonS3Exception ex)
            {
                Console.WriteLine($"Error Code : {ex.ErrorCode}");
                Console.WriteLine($"Status Code: {ex.StatusCode}");
                Console.WriteLine($"Message    : {ex.Message}");
                Console.WriteLine($"Request ID : {ex.RequestId}");
                Console.WriteLine($"Response   : {ex.ResponseBody}");

                throw;
            }
        }
    }
}

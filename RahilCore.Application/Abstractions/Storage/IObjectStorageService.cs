namespace RahilCore.Application.Abstractions.Storage
{
    public interface IObjectStorageService
    {
        Task<string> GetPresignedUrlAsync(string objectKey,int expiryMinutes = 15);

        Task UploadAsync(
            Stream fileStream,
            string objectKey,
            string contentType,
            CancellationToken ct = default);

        Task DeleteAsync(string objectKey,CancellationToken ct = default);
    }
}

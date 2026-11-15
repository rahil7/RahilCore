namespace RahilCore.Infrastructure.Storage.Configurations
{
    public sealed class ObjectStorageOptions
    {
        public const string SectionName = "ObjectStorage";

        public string ServiceURL { get; set; } = string.Empty;
        public string BucketName { get; set; } = string.Empty;
        public string AccessKey { get; set; } = string.Empty;
        public string SecretKey { get; set; } = string.Empty;
    }
}

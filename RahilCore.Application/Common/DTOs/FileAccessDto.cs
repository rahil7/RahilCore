namespace RahilCore.Application.Common.DTOs
{
    public record class FileAccessDto(
        string Url,
        string FileName,
        string FileType,
        long FileSize);
}

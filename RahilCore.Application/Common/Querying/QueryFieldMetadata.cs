namespace RahilCore.Application.Common.Querying
{
    public sealed record QueryFieldMetadata(
        string Field,
        string Label,
        bool CanSearch,
        bool CanSort);
}

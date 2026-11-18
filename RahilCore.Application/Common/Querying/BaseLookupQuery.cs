namespace RahilCore.Application.Common.Querying
{
    public sealed class BaseLookupQuery
    {
        public string? SearchKey { get; set; }

        public int Page { get; set; } = 1;
    }
}

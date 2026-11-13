namespace RahilCore.Application.Features.Customers.Queries
{
    public sealed class CustomerLookupQuery
    {
        public string? SearchKey { get; set; }

        public int Page { get; set; } = 1;
    }
}

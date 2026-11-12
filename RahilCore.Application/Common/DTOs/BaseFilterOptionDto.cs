using RahilCore.Application.Features.Customers;

namespace RahilCore.Application.Common.DTOs
{
    public abstract class BaseFilterOptionDto
    {
        public IReadOnlyList<QueryFieldOptionDto> SearchFields { get; set; } = [];

        public IReadOnlyList<QueryFieldOptionDto> SortFields { get; set; } = [];
    }
}

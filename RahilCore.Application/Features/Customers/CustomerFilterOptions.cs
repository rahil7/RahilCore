using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Customers;

public sealed class CustomerFilterOptions
{
    public IReadOnlyList<FilterOptionDto> Cities { get; set; } = [];

    public IReadOnlyList<FilterOptionDto> CustomerTypes { get; set; } = [];

    public IReadOnlyList<StatusFilterOptionDto> Statuses { get; set; } = [];

    public IReadOnlyList<QueryFieldOptionDto> SearchFields { get; set; } = [];

    public IReadOnlyList<QueryFieldOptionDto> SortFields { get; set; } = [];
}
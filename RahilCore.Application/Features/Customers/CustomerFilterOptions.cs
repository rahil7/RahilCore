using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Customers;

public sealed class CustomerFilterOptions: BaseFilterOptionDto
{
    public IReadOnlyList<FilterOptionDto> Cities { get; set; } = [];

    public IReadOnlyList<FilterOptionDto> CustomerTypes { get; set; } = [];

    public IReadOnlyList<StatusFilterOptionDto> Statuses { get; set; } = [];
}
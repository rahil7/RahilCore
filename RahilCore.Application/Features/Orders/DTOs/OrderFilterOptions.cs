using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Orders.DTOs
{
    public sealed class OrderFilterOptions : BaseFilterOptionDto
    {
        public IReadOnlyList<FilterOptionDto> CustomerTypes { get; set; } = [];
        public IReadOnlyList<FilterOptionDto> InspectionStatus { get; set; } = [];
        public IReadOnlyList<FilterOptionDto> PaymentStatus { get; set; } = [];
    }
}

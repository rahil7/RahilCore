using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Orders.DTOs
{
    public sealed class OrderCreateOptions
    {
        public IReadOnlyList<FilterOptionDto> InspectionForms { get; set; } = [];
        public IReadOnlyList<FilterOptionDto> Cities { get; set; } = [];
        public IReadOnlyList<FilterOptionDto> ExteriorColors { get; set; } = [];
        public IReadOnlyList<FilterOptionDto> Brands { get; set; } = [];
    }
}

using RahilCore.Application.Common.DTOs;
using RahilCore.Application.Features.Users.DTOs;

namespace RahilCore.Application.Features.Inspections.DTOs
{
    public sealed class InspectionFilterOptions : BaseFilterOptionDto
    {
        public IReadOnlyList<FilterOptionDto> CustomerTypes { get; set; } = [];
        public IReadOnlyList<FilterOptionDto> InspectionStatus { get; set; } = [];
        public IReadOnlyList<UserLookupDto> Inspectors { get; set; } = [];
    }
}

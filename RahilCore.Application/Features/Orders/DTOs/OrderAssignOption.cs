using RahilCore.Application.Features.Users.DTOs;

namespace RahilCore.Application.Features.Orders.DTOs
{
    public sealed class OrderAssignOption
    {
        public IReadOnlyList<UserLookupDto> Inspectors { get; set; } = [];
    }
}

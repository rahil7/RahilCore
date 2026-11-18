using RahilCore.Application.Common.DTOs;

namespace RahilCore.Application.Features.Orders.DTOs
{
    public sealed class OrderPaymentCreateOption
    {
        public IReadOnlyList<FilterOptionDto> PaymentMethods { get; set; } = [];
    }
}

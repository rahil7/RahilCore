using System.ComponentModel.DataAnnotations;

namespace RahilCore.Application.Features.Orders.Request
{
    public sealed class CreateOrderDealerRequest : BaseCreateOrderRequest
    {
        [Required]
        public long CustomerId { get; set; }

        [Required]
        [Range(1, 15, ErrorMessage = "Total unit harus antara 1 sampai 15.")]
        public int TotalUnit { get; set; }

        [Required]
        public long InspectionFormId { get; set; }
    }
}

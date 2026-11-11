using System.ComponentModel.DataAnnotations;

namespace RahilCore.Application.Features.Orders.Request
{
    public sealed class CreateOrderDealerRequest
    {
        [Required]
        public long CustomerId { get; set; }

        [Required]
        [Range(1, 20, ErrorMessage = "Total unit harus antara 1 sampai 20.")]
        public int TotalUnit { get; set; }

        [Required]
        public long InspectionFormId { get; set; }

        [Required]
        [StringLength(500)]
        public string Note { get; set; } = string.Empty;
    }
}

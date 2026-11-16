using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace RahilCore.Application.Features.Orders.Request
{
    public sealed class CreatePaymentRequest
    {
        [Range(1, long.MaxValue)]
        public long PaymentMethodId { get; set; }

        [Required]
        public decimal Amount { get; set; }

        public decimal? AmountDiscount { get; set; }

        [Required]
        public DateTime PaymentDate { set; get; }

        public string? ReferenceNo { set; get; }

        [Required]
        [StringLength(500)]
        public string Note { get; set; } = string.Empty;

        public IFormFile? PaymentProof { get; set; }
    }
}

using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace RahilCore.Application.Features.Orders.Request
{
    public sealed class CreatePaymentRequest
    {
        [Range(1, long.MaxValue)]
        public long PaymentMethodId { get; set; }

        [Required]
        public decimal SubtotalAmount { get; set; }

        public decimal? DiscountAmount { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        public string? ReferenceNo { get; set; }

        [Required]
        [StringLength(500)]
        public string Note { get; set; } = string.Empty;

        public IFormFile? PaymentProof { get; set; }
    }
}

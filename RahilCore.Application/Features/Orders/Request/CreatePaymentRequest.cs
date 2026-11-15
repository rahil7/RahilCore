using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace RahilCore.Application.Features.Orders.Request
{
    public sealed class CreatePaymentRequest
    {
        [Required]
        public long PaymentMethodId { get; set; }

        [Required]
        [Range(typeof(decimal), "0.01", "9999999999999999")]
        public decimal Amount { get; set; }

        [Range(typeof(decimal), "0", "9999999999999999")]
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

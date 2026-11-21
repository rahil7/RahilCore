using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace RahilCore.Application.Features.Orders.Request
{
    public sealed class UpdatePaymentRequest
    {
        public long? PaymentMethodId { get; set; }
        public decimal? SubtotalAmount { get; set; }
        public decimal? DiscountAmount { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? ReferenceNo { get; set; }

        [Required]
        public string Note { get; set; } = string.Empty;
        public IFormFile? PaymentProof { get; set; }
    }
}

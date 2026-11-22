using System.ComponentModel.DataAnnotations;

namespace RahilCore.Application.Features.Orders.Request
{
    public sealed class UpdateOrderRequest
    {
        public DateTime? ScheduleAt { get; set; }

        public string? PicName { get; set; }

        public string? PicPhone { get; set; }

        [Required]
        [StringLength(500)]
        public string Note { get; set; } = string.Empty;
    }
}

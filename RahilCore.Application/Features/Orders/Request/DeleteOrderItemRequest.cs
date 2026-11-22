using System.ComponentModel.DataAnnotations;

namespace RahilCore.Application.Features.Orders.Request
{
    public sealed class DeleteOrderItemRequest
    {
        [Required]
        public string Note { get; set; } = string.Empty;
    }
}

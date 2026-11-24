using System.ComponentModel.DataAnnotations;

namespace RahilCore.Application.Features.Orders.Request
{
    public class CancelOrderRequest
    {

        [Required]
        public string Note { get; set; } = string.Empty;
    }
}

using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Contracts;

namespace RahilCore.Application.Features.Orders.Request
{
    public sealed class AssignOrderRequest
    {
        [Required]
        public string InspectorUsername { set; get; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Note { get; set; } = string.Empty;
    }
}

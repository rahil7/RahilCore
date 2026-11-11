using System.ComponentModel.DataAnnotations;

namespace RahilCore.Application.Features.Orders.Request
{
    public sealed class CreateOrderVehicleRequest
    {
        [Required]
        public string PlateNo { get; set; } = string.Empty;

        [Required]
        public long BrandId { get; set; }

        [Required]
        public long ModelId { get; set; }

        [Required]
        public long VariantId { get; set; }

        [Required]
        public int YearOfManufacture { get; set; }

        [Required]
        public long ExteriorColorId { get; set; }
    }
}

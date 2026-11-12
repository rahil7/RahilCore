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
        [Range(1999, 9999, ErrorMessage = "Tahun kendaraan minimal 1999.")]
        public int YearOfManufacture { get; set; }

        [Required]
        public long ExteriorColorId { get; set; }
    }
}

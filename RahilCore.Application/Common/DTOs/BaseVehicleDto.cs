namespace RahilCore.Application.Common.DTOs
{
    public abstract class BaseVehicleDto
    {
        public long VehicleId { get; set; }
        public string? PlateNo { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? Variant { get; set; }
        public int? YearOfManufacture { get; set; }
        public string? ExteriorColor { get; set; }
    }
}

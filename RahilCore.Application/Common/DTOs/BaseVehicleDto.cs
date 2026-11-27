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
        public string? BodyType { get; set; }
        public string? InteriorColor { get; set; }
        public string? InteriorMaterial { get; set; }
        public string? Vin { get; set; }
        public string? EngineNo { get; set; }
        public DateOnly? TaxExpiryDate { get; set; }
        public decimal? Odometer { get; set; }
        public string? FuelType { get; set; }
        public string? Transmission { get; set; }
        public decimal? EngineCapacity { get; set; }
        public string? OwnershipType { get; set; }
        public bool? FirstOwnership { get; set; }
    }
}

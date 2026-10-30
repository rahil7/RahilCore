using System.ComponentModel.DataAnnotations;

namespace RahilCore.Application.Features.Customers.Requests
{
    public sealed class UpdateCustomerRequest
    {
        [StringLength(150)]
        public string? CustName { get; set; }

        [EmailAddress]
        [StringLength(254)]
        public string? Email { get; set; }

        [RegularExpression(@"^628[0-9]{7,12}$", ErrorMessage = "Phone harus diawali 628 dan terdiri dari 10–15 digit.")]
        [StringLength(15)]
        public string? Phone { get; set; }

        public long? CityId { get; set; }

        public string? Address { get; set; }

        [Required]
        [StringLength(500)]
        public string Note { get; set; } = string.Empty;
    }
}

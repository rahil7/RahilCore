using System.ComponentModel.DataAnnotations;

namespace RahilCore.Application.Features.Customers.Requests
{
    public sealed class CreateCustomerRequest
    {
        [Required]
        public long CustTypeId { get; set; }

        [Required]
        [StringLength(30)]
        public string CustCode { get; set; } = string.Empty;

        [Required]
        [StringLength(150)]
        public string CustName { get; set; } = string.Empty;

        [EmailAddress]
        [StringLength(254)]
        public string? Email { get; set; }

        [RegularExpression(@"^628[0-9]{7,12}$", ErrorMessage = "Phone harus diawali 628 dan terdiri dari 10–15 digit.")]
        [StringLength(15)]
        public string? Phone { get; set; }

        public long? CityId { get; set; }

        public string? Address { get; set; }

        public string? Note { get; set; }
    }
}

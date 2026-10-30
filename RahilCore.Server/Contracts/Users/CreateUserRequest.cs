using System.ComponentModel.DataAnnotations;

namespace RahilCore.Server.Contracts.Users
{
    public sealed record CreateUserRequest
    {
        [Required(ErrorMessage = "Username wajib diisi.")]
        [StringLength(50, MinimumLength = 3,
            ErrorMessage = "Username harus terdiri dari 3–50 karakter.")]
        [RegularExpression(@"^[a-zA-Z0-9_.-]+$",
            ErrorMessage = "Username hanya boleh berisi huruf, angka, titik, underscore, dan tanda hubung.")]
        public string Username { get; init; } = string.Empty;

        [Required(ErrorMessage = "Password wajib diisi.")]
        [MinLength(8, ErrorMessage = "Password minimal 8 karakter.")]
        [MaxLength(128, ErrorMessage = "Password maksimal 128 karakter.")]
        public string Password { get; init; } = string.Empty;

        [Required(ErrorMessage = "Nama wajib diisi.")]
        [StringLength(150, MinimumLength = 1,
            ErrorMessage = "Nama harus terdiri dari 1–150 karakter.")]
        public string DisplayName { get; init; } = string.Empty;
    }
}

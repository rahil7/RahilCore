using System.ComponentModel.DataAnnotations;

namespace RahilCore.Server.Contracts.Auth
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Username wajib diisi.")]
        [StringLength(50, ErrorMessage = "Username maksimal 50 karakter.")]
        public string Username { get; init; } = string.Empty;

        [Required(ErrorMessage = "Password wajib diisi.")]
        [MaxLength(128, ErrorMessage = "Password maksimal 128 karakter.")]
        public string Password { get; init; } = string.Empty;
    }
}

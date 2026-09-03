using System.ComponentModel.DataAnnotations;

namespace personal_health_passport.DTOs
{
    public class RegisterRequest
    {

        [Required]
        public string Name { get; set; } = "";

        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = "";

    }
}

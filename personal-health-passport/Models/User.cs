using Microsoft.AspNetCore.Identity;

namespace personal_health_passport.Models
{
    public class User : IdentityUser
    {
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public User (string name , string email)
        {
            Name = name;
            Email = email;
            UserName = email;
            CreatedAt = DateTime.UtcNow;
        }

        public User() { }

    }
}

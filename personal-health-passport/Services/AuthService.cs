using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using personal_health_passport.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace personal_health_passport.Services
{
    public interface IAuthService
    {
        public Task<string?> Login(string email, string password);
        public Task<string?> Register(string name, string email, string password);
    }
    public class AuthService : IAuthService
    {
        
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;

        }

        public static async Task SeedRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider
                .GetRequiredService<RoleManager<IdentityRole>>();

            string[] roles =
            {
                "Admin",
                "Doctor",
                "Patient"
            };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(
                        new IdentityRole(role)
                    );
                }
            }
        }

        private string GenerateJwtToken(User user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim( JwtRegisteredClaimNames.Sub, user.Id),
                new Claim( JwtRegisteredClaimNames.Email, user.Email!)
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<string?> Login(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return null;

            var valid = await _userManager.CheckPasswordAsync(user, password);

            if (!valid)
                return null;

            var roles = await _userManager.GetRolesAsync(user);

            // Generate JWT using user + roles
            return GenerateJwtToken(user, roles);
        }

        public async Task<string?> Register(string name, string email, string password)
        {
            User user = new User(name , email);
            var result = await _userManager.CreateAsync(user,password);
            string err = "Error: ";

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    err += error.Description + '\n';
                }

                return err;
            }

            await _userManager.AddToRoleAsync(user, "Patient");

            var roles = await _userManager.GetRolesAsync(user);

            return GenerateJwtToken(user, roles);
        }

        public void LogOut(string token)
        {
            //Remove auth bearer token from frontend
        }
    }
    
}

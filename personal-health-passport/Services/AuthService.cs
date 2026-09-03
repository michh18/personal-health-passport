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

        public Task<bool> ConfirmEmail(string userId, string token);

        public Task<bool> ForgotPassword(string email);

        public Task<bool> ResetPassword(string userId, string token, string newPassword);
    }
    public class AuthService : IAuthService
    {
        
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ResendService _emailSender;

        public AuthService(UserManager<User> userManager, IConfiguration configuration , ResendService emailSender)
        {
            _userManager = userManager;
            _configuration = configuration;
            _emailSender = emailSender;

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
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!)
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

            if (!user.EmailConfirmed)
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

            //var roles = await _userManager.GetRolesAsync(user);

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            var confirmationUrl = $"{_configuration["FrontendUrl"]}/confirm-email" +
                $"?userId={user.Id}&token={Uri.EscapeDataString(token)}";


            await _emailSender.SendConfirmationLinkAsync(
                user,
                user.Email,
                confirmationUrl
            );

            return "Registration Successful";
        }

        public async Task<bool> ConfirmEmail(string userId, string token)
        { 
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return false;

            var result =
                await _userManager.ConfirmEmailAsync(user, token);

            return result.Succeeded;
        }

        public async Task<bool> ForgotPassword(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return false;

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var passwordUrl = $"{_configuration["FrontendUrl"]}/reset-password" +
                $"?userId={user.Id}&token={Uri.EscapeDataString(token)}";


            try
            {
                await _emailSender.SendPasswordResetLinkAsync(
                    user,
                    user.Email,
                    passwordUrl
                );
            }
            catch
            {
                return false;
            }

            return true; 
        }

        public async Task<bool> ResetPassword(string id,string token,string newPassword)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                return false;

            var result = await _userManager.ResetPasswordAsync(
                user,
                token,
                newPassword
            );

            return result.Succeeded;
        }


    }
    
}

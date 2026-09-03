using Microsoft.AspNetCore.Identity;
using personal_health_passport.DTOs;
using personal_health_passport.Models;
using personal_health_passport.Repositories;

namespace personal_health_passport.Services
{
    public interface IUserService
    {
        List<User> GetAllUser();
        User? GetUserById(string id);
        public Task<bool> DeleteUser(string id);
        public Task<IdentityResult?> ChangeEmail(string id, ChangeEmailRequest dto);

        User? ChangeUsername(string id, string newUsername);
    }
    public class UserService : IUserService
    {
        private readonly IUserRepo _userRepo;
        private readonly UserManager<User> _userManager;

        public int UserId { get; set; }
        public UserService(IUserRepo userRepo, UserManager<User> userManager)
        {
            _userRepo = userRepo;
            _userManager = userManager;

        }

        public List<User> GetAllUser()
        {
            return _userRepo.GetAllUsers();
        }
        public User? GetUserById(string id)
        {
            return _userRepo.GetUserById(id);
        }
        public async Task<bool> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user != null)
            {
                await _userManager.DeleteAsync(user);
                return true;
            }

            return false;
        }
        

        public async Task<IdentityResult?> ChangeEmail(string id, ChangeEmailRequest dto)
        {
            User user = GetUserById(id);
            if (user == null) return null;

            var result = await _userManager.ChangeEmailAsync(user, dto.NewEmail, dto.token);

            if (!result.Succeeded)
            {
                foreach (var e in result.Errors)
                {
                    Console.WriteLine(e.Description);
                }

                return null;
            }

            return result;
        }
        public User? ChangeUsername(string id, string newUsername)
        {
            if (string.IsNullOrWhiteSpace(newUsername)) return null;
            var existing = _userRepo.GetAllUsers();
            bool usernameIsTaken = existing.Any(u => u.Name.ToLower() == newUsername.ToLower() && u.Id != id);
            if (usernameIsTaken) return null;
            return _userRepo.ChangeUsername(id, newUsername);
        }


    }
}

using Microsoft.AspNetCore.Identity;
using personal_health_passport.Models;
using personal_health_passport.Repositories;

namespace personal_health_passport.Services
{
    public interface IUserService
    {
        List<User> GetAllUser();
        User? GetUserById(string id);
        bool DeleteUser(string id);
        User? UpdateUser(string id, User updated);
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
        public bool DeleteUser(string id)
        {
            return _userRepo.DeleteUser(id);
        }
        public User? UpdateUser(string id, User updated)
        {
            return _userRepo.UpdateUser(id, updated);
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

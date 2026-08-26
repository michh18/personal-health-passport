using Microsoft.EntityFrameworkCore;
using personal_health_passport.Models;

namespace personal_health_passport.Repositories
{
    public interface IUserRepo
    {
        List<User> GetAllUsers();
        User? GetUserById(string id);
        User? AddUser(User user);
        bool DeleteUser(string id);
        User? UpdateUser(string id, User user);
        User? ChangeUsername(string id, string newUsername);
        User? GetUserByEmail(string email);
        User? GetUserByUsername(string username);
    }
    public class UserRepo : IUserRepo
    {
        private readonly ClinicalDbContext _context;
        public UserRepo(ClinicalDbContext context)
        {
            _context = context;
        }
        public List<User> GetAllUsers()
        {
            return _context.Users.ToList();

        }
        public User? GetUserById(string id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }
        public User? AddUser(User user)
        {
            if (user == null) return null;
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }
        public bool DeleteUser(string id)
        {
            var user = GetUserById(id);
            if (user == null) return false;
            _context.Users.Remove(user);
            _context.SaveChanges();
            return true;


        }
        public User? UpdateUser(string id, User updatedUser)
        {
            var currUser = GetUserById(id);
            if (currUser == null) return null;
            currUser.Email = updatedUser.Email;
            currUser.PasswordHash = updatedUser.PasswordHash;
            _context.SaveChanges();
            return currUser;

        }
        public User? ChangeUsername(string id, string newUsername)
        {
            if (string.IsNullOrWhiteSpace(newUsername)) return null;
            var user = GetUserById(id);
            if (user == null) return null;
            //hard coding to make sure names of the samekind but differnt Cases are treated the same
            //Test fails
            bool isTaken = _context.Users.Any(u => u.Name.ToLower() == newUsername.ToLower() && u.Id != id);
            if (isTaken) return null;
            //we could throw an excpetion but then we would have to do a try catch later on 
            user.Name = newUsername;
            _context.SaveChanges();
            return user;
        }
        public User? GetUserByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email.ToLower() == email.ToLower());
        }

        public User? GetUserByUsername(string username)
        {
            return _context.Users.FirstOrDefault(u => u.Name.ToLower() == username.ToLower());
        }
    }
}

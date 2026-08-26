using global::personal_health_passport.Models;
using global::personal_health_passport.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace personal_health_passport.Controllers
{ 
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/user
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            var users = _userService.GetAllUser();

            return Ok(users);
        }

        // GET: api/user/5
        [HttpGet("me")]
        public IActionResult GetUserById(string id)
        {
            var user = _userService.GetUserById(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // DELETE: api/user/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteUser(string id)
        {
            var deleted = _userService.DeleteUser(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }

        // PUT: api/user/5
        [HttpPut("me")]
        public IActionResult UpdateUser(string id, [FromBody] User updated)
        {
            var user = _userService.UpdateUser(id, updated);

            if (user == null)
                return NotFound();

            

            return Ok(user);
        }

        // PATCH: api/user/5/username
        [HttpPatch("me/username")]
        public IActionResult ChangeUsername(string id, [FromBody] string newUsername)
        {
            if (string.IsNullOrWhiteSpace(newUsername))
                return BadRequest("Username cannot be empty.");

            var user = _userService.ChangeUsername(id, newUsername);

            if (user == null)
            {
                return Conflict("Username is already taken or user does not exist.");
            }

            return Ok(user);
        }
    }
}


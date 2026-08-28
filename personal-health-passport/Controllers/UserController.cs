using global::personal_health_passport.Models;
using global::personal_health_passport.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        private string? GetLoggedInUserId()
        {
            //Get the UserId from the token, if automatic translation is off it will fallback to using "sub" to find UserId
            //returns null if sub does not exisit 
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                      ?? User.FindFirst("sub")?.Value;

            return claim;
        }

        // GET: api/user
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            var users = _userService.GetAllUser();

            return Ok(users);
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetUserById()
        {
            string id = GetLoggedInUserId();

            if (id == null)
                return Unauthorized();

            var user = _userService.GetUserById(id);

            return Ok(user);
        }

        // GET: api/user/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
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

        
        [HttpPut("me")]
        public IActionResult UpdateUser( [FromBody] User updated)
        {
            string id = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (id == null)
                return Unauthorized();

            var user = _userService.UpdateUser(id, updated);

            if (user == null)
                return NotFound();

            

            return Ok(user);
        }

        // PATCH: api/user/5/username
        [HttpPatch("me/username")]
        public IActionResult ChangeUsername([FromBody] string newUsername)
        {
            if (string.IsNullOrWhiteSpace(newUsername))
                return BadRequest("Username cannot be empty.");

            string id = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (id == null)
                return Unauthorized();

            var user = _userService.ChangeUsername(id, newUsername);

            if (user == null)
            {
                return Conflict("Username is already taken or user does not exist.");
            }

            return Ok(user);
        }
    }
}


using global::personal_health_passport.Models;
using global::personal_health_passport.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using personal_health_passport.DTOs;
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
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var deleted = await _userService.DeleteUser(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }


        [HttpPatch("me/password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NewPassword))
                return BadRequest("Username cannot be empty.");

            string id = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (id == null)
                return Unauthorized();

            var result = await _userService.ChangePassword(id, dto);

            if(result == null)
            {
                return BadRequest("Couldnt change password");
            }

            return Ok(result);
        }

        [HttpPatch("me/email")]
        public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailRequest dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NewEmail))
                return BadRequest("Username cannot be empty.");

            string id = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (id == null)
                return Unauthorized();

            var result = await _userService.ChangeEmail(id, dto);

            if (result == null)
            {
                return BadRequest("Couldnt change email");
            }

            

            return Ok(result);
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


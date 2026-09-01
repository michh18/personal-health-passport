using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using personal_health_passport.Services;
using personal_health_passport.DTOs;
using LoginRequest = personal_health_passport.DTOs.LoginRequest;
using RegisterRequest = personal_health_passport.DTOs.RegisterRequest;

namespace personal_health_passport.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        public AuthController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            
            var result = await _authService.Register(
                request.Name,
                request.Email,
                request.Password
            );
     
            if (result.StartsWith("Error: "))
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest dto)
        {
            var token = await _authService.Login(dto.Email, dto.Password);
            if (token == null) return Unauthorized(new { message = "Invalid email or password." });
            return Ok(new 
            { 
                token 
            });
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string token)
        {
            var result = await _authService.ConfirmEmail(userId, token);

            if (!result)
            {
                return BadRequest("Email confirmation failed.");
            }

            return Ok(new
            {
                message = "Email confirmed successfully."
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            await _authService.ForgotPassword(request.Email);

            return Ok(new
            {
                message = "If an account exists for this email, a password reset link has been sent."
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ChangePasswordRequest request)
        {
            var result = await _authService.ResetPassword(
                request.UserId,
                request.ResetCode,
                request.NewPassword
            );

            if (!result)
                return BadRequest("Password reset failed.");

            return Ok(new
            {
                message = "Password successfully reset."
            });
        }

        [HttpDelete]
        public async Task<IActionResult> testDelete([FromBody] string id)
        {
            bool result = await _userService.DeleteUser(id);

            return result ? Ok() : BadRequest();
        }
    }
}

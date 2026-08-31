using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using personal_health_passport.DTOs;
using personal_health_passport.Services;

namespace personal_health_passport.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            
            if (request.Password != request.ConfirmPassword)
                return BadRequest("Password doesnt match.");

            var token = await _authService.Register(
                request.Name,
                request.Email,
                request.Password
            );
     
            if (token.StartsWith("Error: "))
                return BadRequest(token);

            return Ok(new { token });
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
    }
}

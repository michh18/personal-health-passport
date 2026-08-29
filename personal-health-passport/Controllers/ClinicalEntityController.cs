using Microsoft.AspNetCore.Mvc;
using personal_health_passport.DTOs;
using personal_health_passport.Models;
using personal_health_passport.Services;
using System.Net.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


namespace personal_health_passport.Controllers
{
    [Route("nlp")]
    [ApiController]
    [Authorize]
    public class ClinicalEntityController : Controller
    {
        private readonly HttpClient Http;
        private readonly IClinicalEntityService _entityService;

        public ClinicalEntityController(HttpClient http, IClinicalEntityService entityService)
        {
            _entityService = entityService;
            Http = http;
        }

        private string? GetLoggedInUserId()
        {
            //Get the UserId from the token, if automatic translation is off it will fallback to using "sub" to find UserId
            //returns null if sub does not exisit 
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                      ?? User.FindFirst("sub")?.Value;

            return claim;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateEntities([FromBody] string text)
        {
            try
            {
                var request = new ClinicalTextRequest(text);

                var response = await Http.PostAsJsonAsync(
                    "http://localhost:8000/clinical-text",
                    request
                );


                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode(
                        (int)response.StatusCode,
                        "The NLP service returned an error."
                    );
                }

                var result = await response.Content
                    .ReadFromJsonAsync<ClinicalTextResponse>();

                if (result == null)
                {
                    return BadRequest("The NLP service returned an empty response.");
                }

                string userId = GetLoggedInUserId();
                if(userId == null)
                {
                    return Unauthorized();
                }

                if (_entityService.AddEntitiesToDb(userId,result))
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest("NLP entries could not be entered into database.");
                }

            }
            catch (HttpRequestException)
            {
                return StatusCode(
                    StatusCodes.Status503ServiceUnavailable,
                    "The NLP service is unavailable."
                );
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetEntity(int id)
        {
            var entity = _entityService.GetEntity(id);

            if (entity == null)
                return NotFound();

            return Ok(entity);
        }

        [HttpGet("user")]
        public IActionResult GetAllEntitiesByUser()
        {

            string? userId = GetLoggedInUserId();
            var entities = _entityService.GetAllEntitiesByUser(userId);

            return Ok(entities);
        }

        [HttpPost]
        public IActionResult AddEntity([FromBody] ClinicalEntity entity)
        {
            string? userId = GetLoggedInUserId();
            
            if(userId != null)
            {
                entity.Uid = userId;
            }
            else
            {
                return Unauthorized();
            }

            var result = _entityService.AddEntity(entity);

            return Ok(result);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEntity(int id,[FromBody] ClinicalEntity updatedEntity)
        {
            string? userId = GetLoggedInUserId();

            if (userId == null || updatedEntity.Uid != userId )
            {
                return Unauthorized();
            }

            if(id != updatedEntity.Id)
            {
                return BadRequest();
            }

            var result = _entityService.UpdateEntity(id, updatedEntity);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEntity(int id)
        {

            string? userId = GetLoggedInUserId();
            ClinicalEntity entity = _entityService.GetEntity(id);


            if (entity == null)
            {
                return BadRequest();
            }

            if (userId == null || entity.Uid != userId)
            {
                return Unauthorized();
            }


            var deleted = _entityService.DeleteEntity(id);


            if (!deleted)
                return NotFound();

            return NoContent();
        }

        [HttpDelete]
        public IActionResult DeleteEntities([FromBody] List<ClinicalEntity> entities)
        {
            _entityService.DeleteEntities(entities);

            return NoContent();
        }


    }
}

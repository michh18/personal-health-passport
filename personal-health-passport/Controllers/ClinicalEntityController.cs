using Microsoft.AspNetCore.Mvc;
using personal_health_passport.Models;
using personal_health_passport.Services;
using System.Net.Http;

namespace personal_health_passport.Controllers
{
    [Route("nlp")]
    [ApiController]
    public class ClinicalEntityController : Controller
    {
        private readonly HttpClient Http;
        private readonly IClinicalEntityService _entityService;

        public ClinicalEntityController(HttpClient http, IClinicalEntityService entityService)
        {
            _entityService = entityService;
            Http = http;
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

                if (_entityService.AddEntitiesToDb(result))
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

       
    }
}

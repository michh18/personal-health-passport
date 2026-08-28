namespace personal_health_passport.DTOs
{
    public class ChangeEmailRequest
    {
        public string NewEmail { get; set; } = string.Empty;

        public string token { get; set; } = string.Empty;

    }
}

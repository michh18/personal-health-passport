namespace personal_health_passport.DTOs
{
    public class ChangePasswordRequest
    {
        public string UserId { get; set; } = string.Empty;

        public string ResetCode { get; set; } = string.Empty;

        public string NewPassword { get; set; } = string.Empty;

    }
}

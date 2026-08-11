namespace personal_health_passport.Models
{
    public class ClinicalTextResponse
    {
        public string Text { get; set; } = string.Empty;
        public List<ClinicalEntity> Entities { get; set; } = new();
    }
}

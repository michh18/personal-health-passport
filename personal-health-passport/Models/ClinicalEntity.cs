using System.Collections;

namespace personal_health_passport.Models
{
    public class ClinicalEntity
    {
        public int Id { get; set; }
        public string Uid { get; set; } = string.Empty;
        public string? Entity { get; set; } = string.Empty;
        public string? Trigger { get; set; } = string.Empty;
        public string? Assertion { get; set; } = string.Empty;
        public string? Trend { get; set; }
        public string? Action { get; set; }
        public string? Cui { get; set; } = string.Empty;
        public string? Canonical { get; set; } = string.Empty;
        public int SemanticCodes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;



    }
}

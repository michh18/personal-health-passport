namespace personal_health_passport.Models
{
    public class ClinicalTextRequest
    {
       public string Text { get; set; } = string.Empty;

        public ClinicalTextRequest(string text)
        {
            Text = text;
        }
    }
}

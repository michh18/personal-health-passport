using Microsoft.AspNetCore.Identity;
using personal_health_passport.Models;
using Resend;

namespace personal_health_passport.Services
{
    public class ResendService : IEmailSender<User>
    {
        private readonly IConfiguration _configuration;
        private readonly IResend client;
        private readonly string from;

        public ResendService(IConfiguration configuration , IResend Reclient)
        {
            _configuration = configuration;

            client = Reclient;

            from = Environment.GetEnvironmentVariable("EMAIL_FROM") ?? "Acme <onboarding@resend.dev>";
            //CHANGE
        }

       
        public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
        {
            var message = new EmailMessage
            {
                From = from,
                To = { email },
                Subject = "Hello from Personal Health Passport!",
                HtmlBody = $"<h1>Welcome!</h1><p>Click this link to confirm your email:  <a href='{confirmationLink}'>here</a> </p>",
                TextBody = "Personal Health Passport Confirmation Email."
            };

            try
            {
                var response = await client.EmailSendAsync(message);
                Console.WriteLine("Email sent successfully!");
                Console.WriteLine($"Email ID: {response.Content}");
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }

            
        }

        public Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
        {
            throw new NotImplementedException();
        }

        public Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
        {
            throw new NotImplementedException();
        }
    }
}

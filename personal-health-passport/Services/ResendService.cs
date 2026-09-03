using Microsoft.AspNetCore.Identity;
using personal_health_passport.Models;
using Resend;
using System;

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

        public async Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
        {
           
            var message = new EmailMessage
            {
                From = from,
                To = { email },
                Subject = "Reset your Personal Health Passport password",

                HtmlBody = $@"
                    <h1>Reset your password</h1>
                    <p>
                        We received a request to reset the password for your
                        Personal Health Passport account.
                    </p>

                    <p>
                        Click the link below to create a new password:
                    </p>

                    <p>
                        <a href='{resetLink}'>Reset your password</a>
                    </p>

                    <p>
                        If you didn't request a password reset, you can safely
                        ignore this email.
                    </p>
                ",

                TextBody = $@"
                    We received a request to reset your Personal Health Passport password.

                    Reset your password using the following link:

                    {resetLink}

                    If you didn't request a password reset, you can safely ignore this email.
                "
            };

            try
            {
                var response = await client.EmailSendAsync(message);

                Console.WriteLine("Password reset email sent successfully!");
                Console.WriteLine($"Email ID: {response.Content}");
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}

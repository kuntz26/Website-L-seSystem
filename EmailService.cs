using System.Net;
using System.Net.Mail;

public class EmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var settings = _config.GetSection("EmailSettings");

        var smtp = new SmtpClient
        {
            Host = settings["Host"],
            Port = int.Parse(settings["Port"]),
            EnableSsl = bool.Parse(settings["EnableSsl"]),
            Credentials = new NetworkCredential(
                settings["User"],
                settings["Password"])
        };

        var mail = new MailMessage
        {
            From = new MailAddress(settings["User"]),
            Subject = subject,
            Body = message
        };

        mail.To.Add(toEmail);

        await smtp.SendMailAsync(mail);
    }
}

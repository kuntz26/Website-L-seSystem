using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[action]")]
public class TwoFactorController : ControllerBase
{
    private static Dictionary<string, string> _codes = new();
    private readonly EmailService _email;

    public TwoFactorController(EmailService email)
    {
        _email = email;
    }

    [HttpPost]
    public async Task<IActionResult> Send(TwoFactorRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email))
            return BadRequest("Email is required");

        var code = new Random().Next(100000, 999999).ToString();

        _codes[req.Email] = code;

        await _email.SendEmailAsync(
            req.Email,
            "Din 2FA Login Kode",
            $"Din engangskode er: {code}"
        );

        return Ok(new { message = "Kode sendt til email." });
    }

    [HttpPost]
    public IActionResult Verify(VerifyRequest req)
    {
        if (!_codes.ContainsKey(req.Email))
            return BadRequest("Der er ikke sendt nogen kode.");

        if (_codes[req.Email] != req.Code)
            return BadRequest("Forkert kode!");

        _codes.Remove(req.Email);

        return Ok(new { message = "Godkendt!" });
    }
}

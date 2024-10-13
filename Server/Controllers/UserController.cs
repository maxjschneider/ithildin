using System.Security.Policy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
public class UserController : Controller 
{
    
    private UserManager<ApplicationUser> _userManager;
    private ApplicationDbContext _context;

    public UserController(UserManager<ApplicationUser> userManager, ApplicationDbContext context) 
    {
        _userManager = userManager;
        _context = context;
    }

    private async Task<ApplicationUser?> GetUser() {
        var task = Task.Run(() => _userManager.GetUserAsync(User));
        await Task.WhenAny(task);
        return task.Result;
    }

    [HttpPost("me")]
    public async Task<IActionResult> Me() {
        var user = await GetUser();

        if (user == null) return StatusCode(500);
        else return Ok(user.UserName);
    }

    [HttpPost("addPassword")]
    public async Task<IActionResult> AddPassword([FromBody] Password password) {
        var user = await GetUser();

        if (user == null || user.PasswordHash == null) return StatusCode(500);
        else {
            password.Id = Guid.NewGuid().ToString();
            password.ApplicationUserId = user.Id;
            password.PasswordText = Util.EncryptionService.Encrypt(password.PasswordText, user.PasswordHash);

            user.Passwords.Add(password);
            _context.SaveChanges();

            return Ok();
        }
    }

    
    [HttpGet("getPasswords")]
    public async Task<IActionResult> GetPassword() {
        var user = await GetUser();

        if (user == null) return StatusCode(500);
        else return Ok(user.Passwords);
    }
}
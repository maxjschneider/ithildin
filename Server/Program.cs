using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using System.Drawing;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

var AllowedOrigins = "_AllowedOrigins";

// CORS setup 
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowedOrigins,
        policy  =>
        {
            policy.WithOrigins("http://localhost:8081").AllowCredentials().AllowAnyMethod().AllowAnyHeader().Build();
        }
    );
});

// Swagger setup 
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Identity setup
builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseSqlite("Filename=Db.sqlite"));

builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddTransient<IEmailSender, EmailSender>();

builder.Services.Configure<CookiePolicyOptions>(options => {
    // options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});

builder.Services.Configure<IdentityOptions>(options => {
    // Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 14;
    options.Password.RequiredUniqueChars = 1;

    // Lockout settings.
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings.
    options.User.AllowedUserNameCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = false;

    // SignIn settings.
    options.SignIn.RequireConfirmedEmail = true;
});

builder.Services.ConfigureApplicationCookie(options => {
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.None;
    options.LoginPath = "/Identity/Account/Login";
    options.AccessDeniedPath = "/Identity/Account/AccessDenied";
    options.SlidingExpiration = true;
});

// App start
var app = builder.Build();

// app.UsePathBase(new PathString("/api"));

// app.Use((context, next) =>
// {
//     //The following line adds the siteroot back to the url when being returned to the client, such that https://decumaria:5000/mypage.html becomes https://decumaria:5000:/siteroot/mypage.html
//     context.Request.PathBase = new PathString("/api");
//     //WavaFix: Missing or insecure "X-Content-Type-Options" header
//     context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
//     //WavaFix:
//     context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
//     //WavaFix: Only allow iframes from the same origin
//     context.Response.Headers.Append("X-Frame-Options", "sameorigin");
//     // New locations for powerpoints, pdfs, etc, need to be added the frame-src and connect-src accordingly.
//     //context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; script-src 'self'; object-src 'self'; style-src 'self'; img-src 'self'; media-src 'self'; frame-ancestors 'self'; frame-src 'self'; connect-src 'self';");
//     return next();
// });

app.UseRouting();

app.UseCors(AllowedOrigins);
app.UseCookiePolicy();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapIdentityApi<ApplicationUser>();

app.MapControllers();

app.Run();

using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Emit;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using NuGet.Common;

public class ApplicationUser : IdentityUser 
{
    public virtual ICollection<Password> Passwords { get; set; }
}

public class Password
{
    [JsonIgnore]
    public string? Id {get; set;}

    public string Domain {get; set;}
    public string UserName {get; set; }
    public string PasswordText {get; set;}

    [JsonIgnore]
    public string? ApplicationUserId {get; set;}

    public void Encrypt(string password) {
        Domain = Server.Util.EncryptionService.Encrypt(Domain, password);
        UserName = Server.Util.EncryptionService.Encrypt(UserName, password);
        PasswordText = Server.Util.EncryptionService.Encrypt(PasswordText, password);
    }
}


public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    => optionsBuilder
        .UseLazyLoadingProxies()
        .UseSqlite("Filename=Db.sqlite");

    public DbSet<Password> Passwords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ApplicationUser>(b =>
        {
            // Each User can have many Passwords
            b.HasMany(e => e.Passwords)
                .WithOne()
                .HasForeignKey(pw => pw.ApplicationUserId)
                .IsRequired();
        });
    }
}
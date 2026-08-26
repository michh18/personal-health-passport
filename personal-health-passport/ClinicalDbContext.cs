using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using personal_health_passport.Models;
using System;

namespace personal_health_passport
{
    public class ClinicalDbContext : IdentityDbContext<User>
    {
        public ClinicalDbContext(DbContextOptions<ClinicalDbContext> options)
       : base(options)
        {
        }
        public DbSet<ClinicalEntity> Entities { get; set; }

    }
}

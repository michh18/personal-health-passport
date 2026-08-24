using Microsoft.EntityFrameworkCore;
using personal_health_passport.Models;

namespace personal_health_passport
{
    public class ClinicalDbContext : DbContext
    {
        public DbSet<ClinicalEntity> Entities { get; set; }


    }
}

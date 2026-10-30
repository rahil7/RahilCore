using Microsoft.EntityFrameworkCore;
using RahilCore.Domain.Entities;

namespace RahilCore.Infrastructure.Persistence.DbContext
{
    public sealed class RahilCoreDbContext(
        DbContextOptions<RahilCoreDbContext> options
        ) : Microsoft.EntityFrameworkCore.DbContext(options)
    {
        public DbSet<UserEn> Users => Set<UserEn>();
        public DbSet<CityEn> Cities => Set<CityEn>();
        public DbSet<CustomerEn> Customers => Set<CustomerEn>();
        public DbSet<MasterParameterEn> MasterParameters => Set<MasterParameterEn>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(RahilCoreDbContext).Assembly);
        }
    }
}

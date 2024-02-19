namespace FormProject.Database
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class ODIEntities : DbContext
    {
        public ODIEntities()
            : base("name=ODIEntities")
        {
        }

        public virtual DbSet<Area> Areas { get; set; }
        public virtual DbSet<ODI> ODIs { get; set; }
        public virtual DbSet<TargetPPM> TargetPPMs { get; set; }
        public virtual DbSet<TypeNG> TypeNGs { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}

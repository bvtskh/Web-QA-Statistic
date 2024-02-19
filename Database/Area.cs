namespace FormProject.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Area")]
    public partial class Area
    {
        public int ID { get; set; }

        [Column("Area")]
        [StringLength(100)]
        public string Area1 { get; set; }

        [StringLength(100)]
        public string Customer { get; set; }
    }
}

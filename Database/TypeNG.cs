namespace FormProject.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("TypeNG")]
    public partial class TypeNG
    {
        public int ID { get; set; }

        [Column("TypeNG")]
        [StringLength(500)]
        public string TypeNG1 { get; set; }

        [StringLength(500)]
        public string JP { get; set; }
    }
}

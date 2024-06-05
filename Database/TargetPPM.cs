namespace FormProject.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("TargetPPM")]
    public partial class TargetPPM
    {
        public int ID { get; set; }

        [Required]
        [StringLength(100)]
        public string Area { get; set; }

        public float Target { get; set; }
    }
}

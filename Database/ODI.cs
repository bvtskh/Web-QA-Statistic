namespace FormProject.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ODI")]
    public partial class ODI
    {
        public int ID { get; set; }

        public DateTime DateOccur { get; set; }

        [Required]
        [StringLength(50)]
        public string Customer { get; set; }

        [Required]
        [StringLength(50)]
        public string Shift { get; set; }

        [Required]
        [StringLength(50)]
        public string Station { get; set; }

        [Required]
        [StringLength(50)]
        public string Inspector { get; set; }

        [Required]
        [StringLength(50)]
        public string GroupModel { get; set; }

        [Required]
        [StringLength(50)]
        public string ModelName { get; set; }

        [Required]
        [StringLength(50)]
        public string WO { get; set; }

        [Required]
        public int WOQty { get; set; }

        public int CheckNumber { get; set; }

        public int NumberNG { get; set; }

        public string Note { get; set; }

        [Required]
        [StringLength(50)]
        public string Occur_Time { get; set; }

        [Required]
        [StringLength(50)]
        public string Occur_Line { get; set; }

        [Required]
        [StringLength(50)]
        public string Serial_Number { get; set; }

        [Required]
        [StringLength(50)]
        public string Position { get; set; }

        [Required]
        [StringLength(50)]
        public string Defection { get; set; }

        [Required]
        [StringLength(50)]
        public string Detail { get; set; }

        [Required]
        [StringLength(200)]
        public string NG_Photo { get; set; }

        [Required]
        [StringLength(200)]
        public string OK_Photo { get; set; }

        [Required]
        [StringLength(50)]
        public string Area { get; set; }

        [Required]
        [StringLength(50)]
        public string Sample_Form { get; set; }

        public bool? IsConfirm { get; set; }
    }
}

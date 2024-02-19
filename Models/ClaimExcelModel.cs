using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormProject.Models
{
    public class ClaimExcelModel
    {
        public Nullable<long> RowNumberAll { get; set; }
        public string No { get; set; }
        public Nullable<System.DateTime> Create_date { get; set; }
        public string Customer { get; set; }
        public string Type { get; set; }
        public string Model_name { get; set; }
        public string Model_group { get; set; }
        public string Subject { get; set; }
        public Nullable<System.DateTime> Due_date { get; set; }
        public Nullable<int> Status_approval { get; set; }
        public string Classify4M { get; set; }
        public string Type_Form { get; set; }
        public int Number_NG { get; set; }
    }
}
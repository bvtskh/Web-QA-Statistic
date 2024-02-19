using FormProject.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormProject.Models
{
    public class ClaimListModel
    {
        public List<Claim> claims { get; set; }
        public string filter { get; set; }
        public int start { get; set; }
    }
}
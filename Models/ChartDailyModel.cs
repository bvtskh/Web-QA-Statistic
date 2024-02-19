using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormProject.Models
{
    public class ChartDailyModel
    {
        public string name { get; set; }
        public float day { get; set; }
        public float night
        { get; set; }
        public float total { get; set; }

    }
}

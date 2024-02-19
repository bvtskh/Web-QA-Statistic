using FormProject.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormProject.Models
{
    public class ProcessModel : Process
    {
        public List<string> Action_by { get; set; }
    }
}
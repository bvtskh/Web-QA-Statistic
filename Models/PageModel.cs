using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormProject.Models
{
    public class PageModel
    {
        public string Filter { get; set; }
        public int numberPage { get; set; }
        public int indexStart { get; set; }
    }
}
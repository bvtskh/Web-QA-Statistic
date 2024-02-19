using FormProject.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormProject.Controllers.Database
{
    public class DbManager
    {
        public ClaimFormEntities db { get; set; }
        public DbManager()
        {
            db = new ClaimFormEntities();
        }
    }
}
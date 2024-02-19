using FormProject.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormProject.Models
{
    public class UserSelectModel : User
    {
        public string DisplayName
        {
            get => Id + "-" + Name;
            set
            {
                DisplayName = value;
            }
        }
        public bool IsSelected { get; set; }
    }
}
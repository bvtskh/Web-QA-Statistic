using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace FormProject.Controllers.Helper
{
    public static class UrlHelperExtensions
    {
        public static string ContentVersioned(this UrlHelper self, string contentPath, string extension)
        {
            var version = Bet.Util.Config.GetValue("version");
            string versionedContentPath = "";
            if (version == "0")
            {
                 versionedContentPath = $"{contentPath}.{extension}";
            }
            else
            {
                 versionedContentPath = $"{contentPath}[{version}].{extension}";
            }
           
            return self.Content(versionedContentPath);
        }
    }
}
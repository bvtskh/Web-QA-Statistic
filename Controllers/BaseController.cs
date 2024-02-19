using FormProject.Controllers.Helper;
using FormProject.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormProject.Controllers
{
    public class BaseController : Controller
    {
        public User user = SessionHelper.Get<User>(Constants.SESSION_USER);

        protected override IAsyncResult BeginExecuteCore(AsyncCallback callback, object state)
        {
            try
            {
                SettingLanguage();
                return base.BeginExecuteCore(callback, state);
            }
            catch (Exception)
            {
                return null;
            }
           
        }
        public void SettingLanguage()
        {
            string lang = null;
            HttpCookie langCookie = Request.Cookies["culture"];
            if (langCookie != null)
            {
                lang = langCookie.Value;
            }
            else
            {
                var userLanguage = Request.UserLanguages;
                var userLang = userLanguage != null ? userLanguage[0] : "";
                if (userLang != "")
                {
                    lang = userLang;
                }
                else
                {
                    lang = LanguageMan.GetDefaultLanguage();
                }
            }
            new LanguageMan().SetLanguage(lang);
        }
    }
}
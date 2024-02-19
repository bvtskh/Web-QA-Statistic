using FormProject.Controllers.Database;
using FormProject.Controllers.Helper;
using FormProject.Database;
using FormProject.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FormProject.Controllers
{
    public class HomeController : BaseController
    {
        UserDbManager userManager = new UserDbManager();

        public ActionResult ChangeLanguage(string lang)
        {
            new LanguageMan().SetLanguage(lang);
            return RedirectToAction("Index", "Claim");
        }

        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> Login(User user)
        {
            if (ModelState.IsValid)
            {
                string password = user.Password.MD5Hash();
                var userDb = await userManager.GetUserWithPassword(user.Id, password);
                if (userDb != null)
                {
                    SessionHelper.Set(Constants.SESSION_USER, userDb);
                    return RedirectToAction("Index", "Claim");
                }
                else
                {
                    return View();
                }
            }
            else
            {
                return View();
            }
        }

        public ActionResult Logout()
        {
            if (SessionHelper.Get<User>(Constants.SESSION_USER) != null)
            {
                SessionHelper.Remove(Constants.SESSION_USER);
            }
            return RedirectToAction("Index", "Claim");
        }

        public ActionResult Register()
        {
            SetViewBagForRegister();
            return View();
        }
        private void SetViewBagForRegister()
        {
            ViewBag.Departments = userManager.GetDepartments();
            ViewBag.Positions = userManager.GetPositions();
        }
        [HttpPost]
        public ActionResult Register(User user)
        {
            SetViewBagForRegister();
            if (ModelState.IsValid)
            {
                try
                {
                    if (userManager.GetUserById(user.Id) != null)
                    {
                        ModelState.AddModelError("Dupplicate", "Đã tồn tại user này rồi");
                        return View();
                    }
                    else
                    {
                        user.Password = user.Password.MD5Hash();
                        userManager.Add(user);
                    }

                }
                catch (Exception ex)
                {
                    Console.Write(ex.ToString());
                    ModelState.AddModelError("Error", Resource.Error_Common);
                    return View();
                }

            }
            ModelState.AddModelError("Success", "Đăng kí thành công");
            return View();
        }

        [HttpGet]
        public void Test()
        {
            Console.Write("test");
        }

    }
}
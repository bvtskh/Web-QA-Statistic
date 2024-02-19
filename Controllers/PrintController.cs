using FormProject.Controllers.Database;
using FormProject.Controllers.Helper;
using FormProject.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormProject.Controllers
{
    public class PrintController : Controller
    {
        ClaimDbManager claimManager = new ClaimDbManager();
        UserDbManager userManager = new UserDbManager();
        ProcessDbManager processManager = new ProcessDbManager();
        // GET: Print
        public ActionResult Index(int Id = 0)
        {
            try
            {
                User user = SessionHelper.Get<User>(Constants.SESSION_USER);

                if (user == null)
                {
                    return RedirectToAction("Index", "Claim");
                }

                // Nếu ViewDetal thì không có nav
                SetViewBagForDetail();
                if (Id == 0) return View();

                Claim claim = claimManager.GetClaimById(Id);
                if (claim == null) return View();
                claim.SetProcess();
                claim.SetStep();
                return View(claim);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Error", "Có lỗi xảy ra!" + ex.ToString());
                return View();
            }

        }
        private void SetViewBagForDetail()
        {
            List<User> users = userManager.GetAllUser();
            ViewBag.Submitors = userManager.ConvertUserToUserSelectModel(users);
            ViewBag.Steps = processManager.GetAllProcess();
            ViewBag.ProcessList = processManager.GetAllProcessList();
            ViewBag.ProcessListId = 1;
        }
    }
}
using FormProject.Controllers.Database;
using FormProject.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormProject.Controllers
{
    public class ProcessController : Controller
    {
        ProcessDbManager processManager = new ProcessDbManager();

        public ActionResult CreateProcess()
        {
            List<Process> list = processManager.OrderByDescending();
            return View(list);
        }

        [HttpPost]
        public ActionResult CreateProcess(string name, string canEdit)
        {
            if (processManager.GetProcessByName(name) != null)
            {
                ModelState.AddModelError("Error", "Process đã có tên này rồi!");
                List<Process> listOld = processManager.OrderByDescending();
                return View(listOld);
            }
            Process process = new Process() { Name = name, CanEdit = canEdit == null ? 0 : 1 };

            if (processManager.Add(process) == Constants.STATUS_ERROR)
            {
                ModelState.AddModelError("Error", Resource.Error_Common);
                List<Process> listOld = processManager.OrderByDescending();
                return View(listOld);
            }
            List<Process> list = processManager.OrderByDescending();
            return View(list);
        }

        public ActionResult DeleteProcess(int Id)
        {
            if (processManager.Delete(Id) == Constants.STATUS_ERROR)
            {
                ModelState.AddModelError("Error", Resource.Error_Common);
                return View();
            }
            return RedirectToAction("CreateProcess");
        }

        public ActionResult CreateProcessTemplate()
        {
            ViewBag.ProcessList = processManager.GetAllProcess();
            return View();
        }

        public ActionResult SaveProcess(string displayName, string process)
        {
            ProcessList pList = new ProcessList()
            {
                DisplayName = displayName,
                Process = process
            };
            if (processManager.Add(pList) == Constants.STATUS_ERROR)
            {
                ModelState.AddModelError("Error", Resource.Error_Common);
                return View();
            }
            TempData["SaveProcess"] = Constants.Result_OK;
            TempData["SaveProcessContent"] = "Bạn vừa tạo thành công 1 process";
            return RedirectToAction("CreateProcessTemplate");
        }
    }
}
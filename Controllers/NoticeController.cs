using FormProject.Controllers.Database;
using FormProject.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FormProject.Controllers
{
    public class NoticeController : BaseController
    {
        NoticeDbManager noticeManager = new NoticeDbManager();

        public async Task<JsonResult> Notice()
        {
            if (user == null) return Json(new { body = "", number = 0 }, JsonRequestBehavior.AllowGet);
            var userId = user.Id;
            List<Notice> list = await noticeManager.GetAllNoticeSync(userId);
            List<Notice> listUnRead = await noticeManager.GetNoticeRead(userId);

            if (list != null && list.Count > 0)
            {
                return Json(new
                {
                    body = Utils.ConvertViewToString("~/Views/Notice/_Notice.cshtml", list, ViewData, ControllerContext),
                    number = listUnRead.Count
                },
                    JsonRequestBehavior.AllowGet);
            }
            else return Json(new { body = "", number = 0 }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteNotice()
        {
            var userId = user != null ? user.Id : "";
            if (!string.IsNullOrEmpty(userId))
            {
                noticeManager.Delete(userId);
            }
            return Json("", JsonRequestBehavior.AllowGet);

        }

    }
}
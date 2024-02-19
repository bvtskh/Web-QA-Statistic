using FormProject.Controllers.Database;
using FormProject.Controllers.Helper;
using FormProject.Database;
using FormProject.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FormProject.Controllers
{
    public class ClaimController : BaseController
    {
        ClaimDbManager claimManager = new ClaimDbManager();
        NoticeDbManager noticeManager = new NoticeDbManager();
        UserDbManager userManager = new UserDbManager();
        ProcessDbManager processManager = new ProcessDbManager();

        // GET: Claim
        public ActionResult Index(string filter = "")
        {
            if (user != null)
            {
                HttpContext.Application["NumberWaitMe"] = claimManager.GetNumberClaimWaitMe(user.Id); ;
            }
            var list = new List<Claim>();
            if (user != null)
            {
                ViewBag.Notices = noticeManager.GetAllNotice(user.Id);
                using (var db = new ClaimFormEntities())
                {


                    if (string.IsNullOrEmpty(filter) || filter == Constants.All)
                    {
                        list = db.Claims.Where(m => m.IsNewest == 1).ToList();
                    }
                    else if (filter == Constants.Filter_Draft)
                    {
                        list = db.Claims.Where(m => m.IsNewest == 1 && m.Create_by == user.Id && m.Status_approval == Constants.Status_Init).ToList();
                    }
                    else if (filter == Constants.Filter_MyClaim)
                    {
                        list = db.Claims.Where(m => m.IsNewest == 1 && m.Create_by == user.Id && m.Status_approval == Constants.Status_Init).ToList();
                    }
                    else if (filter == Constants.Filter_WaitingMe)
                    {
                        list = db.Claims.Where(m => m.IsNewest == 1 && m.Next_Action_by.Contains(user.Id)).ToList();
                    }
                    ViewBag.Filter = filter;

                }
              


            }
            return View(list);
        }
     
        public JsonResult Load(string filter, int indexStart = 0, string search = "")
        {
            try
            {
                using (var db = new ClaimFormEntities())
                {
                    List<Claim> list = new List<Claim>();
                    if (filter == Constants.All)
                    {
                        if (string.IsNullOrEmpty(search))
                        {
                            list = db.Claims.Where(m => m.IsNewest == 1).OrderByDescending(m => m.Modify_date).Take(20).ToList();
                        }
                        else
                        {
                            list = db.Claims.Where(m => m.IsNewest == 1 && m.No.ToLower().Contains(search.ToLower())).OrderByDescending(m => m.Modify_date).Take(20).ToList();
                        }
                    }
                    else if (filter == Constants.Filter_Draft)
                    {
                        if (string.IsNullOrEmpty(search))
                        {
                            list = db.Claims.Where(m => m.IsNewest == 1 && m.Create_by == user.Id && m.Status_approval == Constants.Status_Init).OrderByDescending(m => m.Modify_date).Take(20).ToList();
                        }
                        else
                        {
                            list = db.Claims.Where(m => m.IsNewest == 1 && m.Create_by == user.Id && m.No.ToLower().Contains(search.ToLower()) && m.Status_approval == Constants.Status_Init).OrderByDescending(m => m.Modify_date).Take(20).ToList();
                        }
                    }
                    else if (filter == Constants.Filter_MyClaim)
                    {
                        if (string.IsNullOrEmpty(search))
                        {
                            list = db.Claims.Where(m => m.IsNewest == 1 && m.Create_by == user.Id).OrderByDescending(m => m.Modify_date).Take(20).ToList();
                        }
                        else
                        {
                            list = db.Claims.Where(m => m.IsNewest == 1 && m.No.ToLower().Contains(search.ToLower()) && m.Create_by == user.Id).OrderByDescending(m => m.Modify_date).Take(20).ToList();
                        }
                    }
                    else if (filter == Constants.Filter_WaitingMe)
                    {
                        if (string.IsNullOrEmpty(search))
                        {
                            list = db.Claims.Where(m => m.IsNewest == 1 && m.Next_Action_by.Contains(user.Id)).OrderByDescending(m => m.Modify_date).Take(20).ToList();
                        }
                        else
                        {
                            list = db.Claims.Where(m => m.IsNewest == 1 && m.No.ToLower().Contains(search.ToLower()) && m.Next_Action_by.Contains(user.Id)).Take(20).ToList();
                        }
                    }
                    return Json(new
                    {
                        body = Utils.ConvertViewToString("~/Views/Claim/_ListClaim.cshtml", list, ViewData, ControllerContext),

                    },
                JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                return Json(new
                {

                }, JsonRequestBehavior.AllowGet);

            }

        }

        [HttpGet]
        public ActionResult Detail(int Id = 0)
        {
            try
            {
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
                ViewBag.histories = claimManager.GetClaimHistory(claim.No);
                SetViewBagUserExcept(claim);
                if (claim.CanEdit == 0 || (claim.NextStep != null && !claim.NextStep.Action_by.Contains(user.Id)))
                {
                    return RedirectToAction("ClaimView", new { Id = Id });
                }
                // Nếu có thông báo thì sửa thành đã đọc
                if (noticeManager.ChangeNoticeToRead(claim.Id, user.Id) == Constants.STATUS_ERROR)
                {
                    ModelState.AddModelError("Error", Resource.Error_Common);
                    return View();
                }

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
        private void SetViewBagUserExcept(Claim claim)
        {
            List<string> listExcept = new List<string>();
            foreach (var process in claim.processes)
            {
                if (process.Id <= claim.Status_approval)
                {
                    listExcept.AddRange(process.Action_by);
                }
            }
            if (user != null)
                listExcept.Add(user.Id);
            ViewBag.listExcept = listExcept;
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Detail(Claim claim)
        {
            SetViewBagForDetail();
            if (ModelState.IsValid && user != null)
            {
                // copy lại claim để nếu xảy ra lỗi thì vẫn giữ nguyên dữ liệu ng dùng đã nhập
                var tempClaim = claim.copy();

                // validate lại các trường xem còn thiếu thông tin gì không?
                if (claim.ProcessListId == 0)
                {
                    ModelState.AddModelError("Error", "Bạn cần chọn loại form!");
                    return View(tempClaim);
                }

                if (claim.Id == 0 && claimManager.GetClaimHistory(claim.No).Count > 0)
                {
                    ViewBag.ErrorDupplicateNo = "ErrorDupplicateNo";
                    ModelState.AddModelError("Error", "Mã quản lý đã tồn tại rồi!");
                    return View(tempClaim);
                }


                // Trường hợp tạo mới thì create_by == null -> set create_by
                if (claim.Create_by == null)
                {
                    claim.Create_by = user.Id;
                }
                // process hiện đang chưa có người init và create -> thêm vào 
                claim.Process = claim.AddCreateByToProcess(claim.Process, claim.Create_by);

                // process đang dưới dạng string -> chuyển sang dạng List
                claim.SetProcess();

                //lấy ra step trước, hiện tại và sau
                claim.SetStep();

                // trường hợp mới tạo thì status = null -> set là created
                if (claim.Status_approval == null)
                {
                    claim.Status_approval = claim.GetProcessID(claim.Process.Split(',')[1]);
                }
                // trường hợp sửa thì status gán bằng status sẽ được xác nhận tiếp theo
                else
                {
                    if (claim.ActionName == Constants.Action_Reject)
                    {
                        claim.Status_approval = claim.PreviousStep.Id;
                    }
                    else if (claim.ActionName == Constants.Action_Approved)
                    {
                        claim.Status_approval = claim.NextStep.Id;
                    }

                }

                // vì status thay đổi nên set lại các step theo status 
                claim.SetStep();
                claim.Modify_by = user.Id;
                claim.Modify_date = DateTime.Now;
                claim.IsNewest = 1;
                if (claim.NextStep != null && claim.NextStep.Action_by != null)
                    claim.Next_Action_by = string.Join(",", claim.NextStep.Action_by);

                if (claim.ActionName == Constants.Action_Draft)
                {
                    int result = ActionDraft(tempClaim, ref claim, Error =>
                    {
                        ModelState.AddModelError("Error", Error);
                    }, Success =>
                    {
                        TempData["SaveClaim"] = Constants.Result_OK;
                        TempData["SaveClaimContent"] = Success;
                    });
                    if (result == Constants.STATUS_ERROR)
                    {
                        return View(tempClaim);
                    }
                    return RedirectToAction("Index");
                }

                else if (claim.ActionName == Constants.Action_Approved)
                {
                    int result = ActionApprove(ref claim, tempClaim,
                        Error =>
                        {
                            ModelState.AddModelError("Error", Error);

                        }, Success =>
                        {
                            TempData["SaveClaim"] = Constants.Result_OK;
                            TempData["SaveClaimContent"] = Success;
                        });
                    if (result == Constants.STATUS_ERROR)
                    {
                        return View(tempClaim);
                    }

                    result = NoticeToReceiver(claim, Resource.Notice_Approve, Error =>
                     {
                         ModelState.AddModelError("Error", Resource.Error_User_Not_Exist);
                     }, Success =>
                     {
                     });
                    if (result == Constants.STATUS_ERROR)
                    {
                        return View(tempClaim);
                    }

                    return RedirectToAction("Index");
                }
                else if (claim.ActionName == Constants.Action_Reject)
                {
                    int result = ActionReject(ref claim, tempClaim, Error =>
                    {
                        ModelState.AddModelError("Error", Error);
                    }, Success =>
                    {
                        TempData["SaveClaim"] = Constants.Result_OK;
                        TempData["SaveClaimContent"] = Success;
                    });
                    if (result == Constants.STATUS_ERROR)
                    {
                        return View(tempClaim);
                    }

                    result = NoticeToReceiver(claim, Resource.Notice_Reject, Error =>
                    {
                        ModelState.AddModelError("Error", Resource.Error_User_Not_Exist);
                    }, Success =>
                    {
                    });
                    if (result == Constants.STATUS_ERROR)
                    {
                        return View(tempClaim);
                    }

                    return RedirectToAction("Index");
                }

                return RedirectToAction("Index");
            }
            else
            {
                ModelState.AddModelError("Error", Resource.Error_Lack_Info);

                // process đang dưới dạng string -> chuyển sang dạng List
                claim.SetProcess();

                //lấy ra step trước, hiện tại và sau
                claim.SetStep();
                return View(claim);
            }

        }
        private int NoticeToReceiver(Claim claim, string notice, Action<string> Error, Action<string> Success)
        {
            // Gửi thông báo cho người được asign nếu người asign không phải người đang đăng nhập hiện tại
            if (claim.NextStep != null && claim.NextStep.Action_by != null)
            {
                List<User> ReceiverUsers = new List<User>();
                foreach (string u in claim.NextStep.Action_by)
                {
                    if (u != user.Id)
                    {
                        User ReceiverUser = userManager.GetUserById(u);
                        if (ReceiverUser != null)
                            ReceiverUsers.Add(ReceiverUser);
                    }

                }

                if (ReceiverUsers.Count > 0)
                {
                    if (SendBroadCast(claim.Id, claim.No, DateTime.Now,
                   ReceiverUsers,
                   notice,
                   BroadcastError =>
                   {
                       ModelState.AddModelError("Error", BroadcastError);
                   },
                   BroadcastSucccess =>
                   {
                       // Để lấy Id cho việc gửi thông báo dưới client
                       TempData["NextActionBy"] = BroadcastSucccess;
                   }) == Constants.STATUS_ERROR)
                    {
                        Error(Resource.Error_Send_Notice);
                        return Constants.STATUS_ERROR;
                    }
                    //Gửi mail cho người được assign
                    SendMailToReceiver(notice, claim.CanEdit == 1 ? 1 : 0, claim.Id, ReceiverUsers, claim.No);
                }
                return Constants.STATUS_SUCCESS;
            }
            return Constants.STATUS_SUCCESS;
        }

        private void SendMailToReceiver(string content, int canEdit, int claimId, List<User> receivers, string claimNo)
        {

            if (user == null) return;
            var url = Request.Url.ToString();
            int indexOf = url.IndexOf("Claim");
            url = url.Substring(0, indexOf);
            url += canEdit == 1 ? "Claim/Detail/" : "Claim/ClaimView/";
            url += claimId;
            content = Constants.CONTENT_OUTLOOK(url, user.Email, claimNo);
            foreach (User receiver in receivers)
            {
                Outlook.SendMail(receiver.Email, Constants.SUBJECT, content);
            }

        }

        private int SendBroadCast(int claimId, string claimNo, DateTime sendDate, List<User> receivers, string noticeContent, Action<string> Error, Action<string> Success)
        {
            if (user == null) return Constants.STATUS_ERROR;
            foreach (var receiver in receivers)
            {
                Notice notice = new Notice()
                {
                    ClaimId = claimId,
                    SendDate = sendDate,
                    Reciever = receiver.Id,
                    NoticeContent = string.Format(noticeContent, user.Name, claimNo)
                };

                if (noticeManager.Add(notice) == Constants.STATUS_ERROR)
                {
                    Error(Resource.Error_Common);
                    return Constants.STATUS_ERROR;
                }

            }

            Success(string.Join(",", receivers));
            return Constants.STATUS_SUCCESS;
        }

        private int ActionReject(ref Claim claim, Claim tempClaim, Action<string> Error, Action<string> Success)
        {
            // set lại claim về trạng thái cũ
            claim.Status_approval = tempClaim.SteptToReject; // status = 4

            // vì status thay đổi nên phải set lại step
            claim.SetStep(); // previos = 3, current = 4; next = 5

            // reject về trang thái 3 thì current sẽ là next step của claim
            claim.CanEdit = claim.NextStep.CanEdit;
            if (claimManager.Add(claim) == Constants.STATUS_ERROR)
            {
                Error(Resource.Error_Common);
                return Constants.STATUS_ERROR;
            }
            claim.ActionName = Constants.Action_Reject;
            Success(string.Format(Resource.Notice_Modify_Claim, claim.No));
            return Constants.STATUS_SUCCESS;
        }

        private int ActionApprove(ref Claim claim, Claim tempClaim, Action<string> Error, Action<string> Success)
        {
            if (claim.Status_approval == Constants.Status_Create)
            {
                if (claim.Create_date is DateTime create_date)
                {
                    claim.Due_date = create_date.AddDays(Constants.DUE_DATE);
                    claim.Status = Constants.STATUS_OPEN;
                }
            }
            if (claim.NextStep == null)
            {
                claim.Status = Constants.STATUS_CLOSE;
            }
            claim.CanEdit = claim.NextStep != null ? claim.NextStep.CanEdit : 0;
            claim.Comment_reject = null;
            claim.ActionName = null;
            string claimContent = claim.Id == 0 ?
               string.Format(Resource.Notice_Create_Claim, claim.No) :
                 string.Format(Resource.Notice_Modify_Claim, claim.No);

            if (claimManager.Add(claim) == Constants.STATUS_ERROR)
            {
                Error(Resource.Error_Common);
                return Constants.STATUS_ERROR;
            }
            Success(claimContent);
            return Constants.STATUS_SUCCESS;
        }

        private int ActionDraft(Claim tempClaim, ref Claim claim, Action<string> Error, Action<string> Success)
        {
            // trường hợp mới tạo hoặc đã tạo rồi nhưng vẫn để draft thì status, canedit và next action by bằng null
            if (tempClaim.Id == 0 || tempClaim.Status_approval == Constants.Status_Init)
            {
                tempClaim.Status_approval = Constants.Status_Init;
                tempClaim.CanEdit = 1;
            }
            tempClaim.SetProcess();
            tempClaim.SetStep();

            // Các trạng thái giữ nguyên
            claim.Status_approval = tempClaim.Status_approval;
            claim.CanEdit = tempClaim.NextStep != null ? tempClaim.NextStep.CanEdit : 0;
            claim.Comment_reject = null;
            claim.ActionName = null;
            string claimContent = claim.Id == 0 ?
                   "Bạn vừa tạo thành công claim số " + claim.No :
                   "Bạn vừa sửa thành công claim số " + claim.No;

            if (claimManager.Add(claim) == Constants.STATUS_ERROR)
            {
                ModelState.AddModelError("Error", Resource.Error_Common);
                Error(Resource.Error_Common);
                return Constants.STATUS_ERROR;
            }

            Success(claimContent);
            return Constants.STATUS_SUCCESS;
        }

        public ActionResult ClaimView(int Id = 0)
        {
            try
            {
                if (Id == 0) return RedirectToAction("Index");
                List<User> users = userManager.GetAllUser();
                ViewBag.Submitors = users.Select((x, i) => new UserSelectModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Email = x.Email
                }).ToList();
                Claim claim = claimManager.GetClaimById(Id);
                claim.SetProcess();
                claim.SetStep();
                ViewBag.histories = claimManager.GetClaimHistory(claim.No);
                SetViewBagForDetail();
                SetViewBagUserExcept(claim);
                if (user != null && claim.NextStep != null && claim.NextStep.Action_by != null && claim.NextStep.Action_by.Contains(user.Id) && claim.CanEdit == 1)
                {
                    return RedirectToAction("Detail", new { Id = Id });
                }

                // Nếu có thông báo thì sửa thành đã đọc
                if (user != null)
                {
                    if (noticeManager.ChangeNoticeToRead(claim.Id, user.Id) == Constants.STATUS_ERROR)
                    {
                        ModelState.AddModelError("Error", "Có lỗi xảy ra!");
                        return View();
                    }
                }

                return View(claim);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                ModelState.AddModelError("Error", "Có lỗi xảy ra!");
                return View();
            }

        }
        public JsonResult History(int Id)
        {
            Claim claim = claimManager.GetClaimById(Id);
            return Json(claim, JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> Export()
        {
            MemoryStream bufferStream = null;
            await Task.Run(async () =>
            {
                var list = claimManager.GetListClaimToExcel(1, int.MaxValue);
                var stream = await ExportUtils.CreateExcelFile(null, list);
                // Tạo buffer memory strean để hứng file excel
                bufferStream = stream as MemoryStream;
                Console.WriteLine("task...");

            });
            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            // Dòng này rất quan trọng, vì chạy trên firefox hay IE thì dòng này sẽ hiện Save As dialog cho người dùng chọn thư mục để lưu
            // File name của Excel này là ExcelDemo
            Response.AddHeader("Content-Disposition", "attachment; filename=ClaimReport.xlsx");
            // Lưu file excel của chúng ta như 1 mảng byte để trả về response
            Response.BinaryWrite(bufferStream.ToArray());
            Console.WriteLine("done!");
            // Send tất cả ouput bytes về phía clients
            Response.Flush();
            Response.End();
            return View("Index");
        }

        public ActionResult Chart()
        {
            ViewBag.Filter = Constants.Claim_Chart;
            return View();
        }

        public JsonResult DrawChart(string start, string end)
        {
            try
            {
                using (var db = new ClaimFormEntities())
                {
                    DateTime startDate = DateTime.Parse(start);
                    DateTime endDate = DateTime.Parse(end);
                    var list = db.Claims.Where(m => m.IsNewest == 1 && m.Occur_date >= startDate && m.Occur_date <= endDate).OrderBy(m => m.Occur_date).ToList();

                    var groupByDates = from p in list
                                       group p.No by p.Subject into g
                                       select new { subject = g.Key, Count = g.Count() };
                    var groupByCustomer = from p in list
                                          group p.No by p.Customer into g
                                          select new { customer = g.Key, Count = g.Count() };
                    var barLabels = new List<string>();
                    var barDatas = new List<int>();
                    var pieLabels = new List<string>();
                    var pieDatas = new List<int>();
                    foreach (var g in groupByDates)
                    {
                        barLabels.Add(g.subject);
                        barDatas.Add(g.Count);
                    }
                    foreach(var g in groupByCustomer)
                    {
                        pieLabels.Add(g.customer);
                        pieDatas.Add(g.Count);
                    }
                    return Json(new
                    {
                        barLabels = barLabels,
                        barDatas = barDatas,
                        pieLabels = pieLabels,
                        pieDatas = pieDatas
                    },
                JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                return Json(new
                {

                }, JsonRequestBehavior.AllowGet);

            }

        }
    }
}
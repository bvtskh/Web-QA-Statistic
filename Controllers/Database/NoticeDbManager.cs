using FormProject.Database;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FormProject.Controllers.Database
{
    public class NoticeDbManager : DbManager
    {
        public async Task<List<Notice>> GetAllNoticeSync(string userId)
        {
            List<Notice> list = new List<Notice>();
            try
            {
                return await db.Notices.Where(m => m.Reciever == userId).OrderByDescending(m => m.SendDate).ToListAsync();

            }
            catch (Exception)
            {
                return list;
            }
        }
        public List<Notice> GetAllNotice(string userId)
        {
            List<Notice> list = new List<Notice>();
            try
            {
                return db.Notices.Where(m => m.Reciever == userId).OrderByDescending(m => m.SendDate).ToList();

            }
            catch (Exception)
            {
                return list;
            }
        }
        public async Task<List<Notice>> GetNoticeRead(string userId)
        {
            List<Notice> list = new List<Notice>();
            try
            {
                return  await db.Notices.Where(m => m.Reciever == userId && m.IsRead != 1).ToListAsync();

            }
            catch (Exception)
            {
                return list;
            }
        }

        public int Delete(string userId)
        {
            try
            {
                db.Notices.RemoveRange(db.Notices.Where(m => m.Reciever == userId));
                db.SaveChanges();
                return Constants.STATUS_SUCCESS;
            }
            catch (Exception)
            {
                return Constants.STATUS_ERROR;
            }
           
        }
        public int Add(Notice notice)
        {
            try
            {
                db.Notices.Add(notice);
                db.SaveChanges();
                return Constants.STATUS_SUCCESS;
            }
            catch (Exception e)
            {
                return Constants.STATUS_ERROR;
            }
        }

        public int ChangeNoticeToRead(int claimId, string userId)
        {
            try
            {
                Notice notice = db.Notices.Where(m => m.ClaimId == claimId && m.Reciever == userId).FirstOrDefault();
                if (notice != null && notice.IsRead != 1)
                {
                    notice.IsRead = 1;
                    db.SaveChanges();
                }
                return Constants.STATUS_SUCCESS;
            }
            catch (Exception)
            {
                return Constants.STATUS_ERROR;
            }
          
        }
    }
}
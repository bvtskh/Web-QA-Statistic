using FormProject.Database;
using FormProject.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FormProject.Controllers.Database
{
    public class ClaimDbManager : DbManager
    {

        public int GetNumberClaimWaitMe(string userId)
        {
            try
            {
                var param = new SqlParameter("@userId", userId);
                return db.Database
                    .SqlQuery<int>("Pro_NumberWaitMe @userId", param)
                    .FirstOrDefault();
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public int GetNumberClaim(string filter, string userId)
        {
            try
            {
                var filterCountParam = new SqlParameter("@filter", filter);
                var userIdCountParam = new SqlParameter("@userId", userId);
                return db.Database
                    .SqlQuery<int>("proc_list_claim_count @filter, @userId", filterCountParam, userIdCountParam)
                    .FirstOrDefault();
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public int GetRowNumber(string filter, string userId, string search)
        {
            try
            {
                SqlParameter userIdParam = new SqlParameter("@userId", userId);
                var filterParam = new SqlParameter("@filter", filter);
                var searchParam = new SqlParameter("@search", search);
                return db.Database
                    .SqlQuery<int>("proc_search_claim @search, @filter, @userId", searchParam, filterParam, userIdParam)
                    .FirstOrDefault();
            }
            catch (Exception)
            {
                return 0;
            }
        }
        public List<ClaimExcelModel> GetListClaimToExcel(int start, int end)
        {
            var startParam = new SqlParameter("@start", start);
            var endParam = new SqlParameter("@end", end);
            object[] parameters = new object[] { startParam, endParam };
            return db.Database
                   .SqlQuery<ClaimExcelModel>(" exec proc_list_claim @start, @end", parameters)
                   .ToList();
        }
        public List<Claim> GetListClaim(int indexStart, string filter, string userId)
        {
            try
            {
                var start = new SqlParameter("@start", indexStart);
                var end = new SqlParameter("@end", indexStart + Constants.PageSize - 1);
                SqlParameter filterParam = new SqlParameter("@filter", filter);
                SqlParameter userIdParam = new SqlParameter("@userId", userId);
                return db.Database
                       .SqlQuery<Claim>("proc_list_claim_page @start, @end, @filter, @userId", start, end, filterParam, userIdParam)
                       .ToList();
            }
            catch (Exception e)
            {
                return new List<Claim>();
            }

        }
        public Claim GetClaimById(int Id)
        {
            try
            {
                return db.Claims.Where(m => m.Id == Id).FirstOrDefault();
            }
            catch (Exception)
            {
                return null;
            }
        }
        public List<Claim> GetClaimHistory(string No)
        {
            try
            {
                List<Claim> list = db.Claims.Where(m => m.No == No).OrderByDescending(m => m.Modify_date).ToList();
                return list != null ? list : new List<Claim>();
            }
            catch (Exception)
            {
                return new List<Claim>();
            }
        }
        public int Add(Claim claim)
        {
            try
            {
                claim.User1 = null;
                db.Claims.Add(claim);
                db.SaveChanges();
                return Constants.STATUS_SUCCESS;
            }
            catch (Exception e)
            {
                return Constants.STATUS_ERROR;
            }
        }

        public List<Claim> GetClaimOverDate()
        {
            try
            {
                return db.Claims.Where(m => m.IsNewest == 1 && m.Due_date < DateTime.Now).ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
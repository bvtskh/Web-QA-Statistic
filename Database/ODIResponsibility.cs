using FormProject.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace FormProject.Database
{
    public class ODIResponsibility
    {
        public ChartItem odi_DayNightPerformance(DateTime start, DateTime end, string area, string oqcProcess, string shift, ODIEntities db)
        {
            try
            {
                var areaParams = new SqlParameter("@area", area);
                var oqcParams = new SqlParameter("@oqcProcess", oqcProcess);
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                var shiftDayParams = new SqlParameter("@Shift", shift);
                return db.Database
                      .SqlQuery<ChartItem>("odi_DayNightPerformance @start, @end, @area, @oqcProcess,@Shift",
                      startParams, endParams, areaParams, oqcParams, shiftDayParams)
                      .FirstOrDefault();
            }
            catch (Exception ex)
            {
                return new ChartItem();
            }
        }
        public List<ChartItem> odi_ListArea(DateTime start, DateTime end, string oqcProcess, ODIEntities db)
        {
            try
            {
                var oqcParams = new SqlParameter("@oqcProcess", oqcProcess);
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                return db.Database
                      .SqlQuery<ChartItem>("odi_listArea @start, @end, @oqcProcess",
                      startParams, endParams, oqcParams)
                      .ToList();
            }
            catch (Exception ex)
            {
                return new List<ChartItem>();
            }
        }
        public List<ChartItem> odi_DailyPerformance(DateTime start, DateTime end, string area, string oqcProcess, string shift, ODIEntities db)
        {
            try
            {
                var areaParams = new SqlParameter("@area", area);
                var oqcParams = new SqlParameter("@oqcProcess", oqcProcess);
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                var shiftDayParams = new SqlParameter("@Shift", shift);
                return db.Database
                      .SqlQuery<ChartItem>("odi_DailyPerformance @start, @end, @area, @oqcProcess,@Shift",
                      startParams, endParams, areaParams, oqcParams, shiftDayParams)
                      .ToList();
            }
            catch (Exception ex)
            {
                return new List<ChartItem>();
            }
        }
        public List<ChartItemWithDate> odi_WeeklyReview(DateTime start, DateTime end, string area, string oqcProcess, ODIEntities db)
        {
            try
            {
                var areaParams = new SqlParameter("@area", area);
                var oqcParams = new SqlParameter("@oqcProcess", oqcProcess);
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                return db.Database
                      .SqlQuery<ChartItemWithDate>("odi_WeeklyReview @start, @end, @area, @oqcProcess",
                      startParams, endParams, areaParams, oqcParams)
                      .ToList();
            }
            catch (Exception ex)
            {
                return new List<ChartItemWithDate>();
            }
        }
        public List<ChartItemWithDate> odi_ListIncrement(DateTime start, DateTime end, string oqcProcess, ODIEntities db)
        {
            try
            {
                var oqcParams = new SqlParameter("@oqcProcess", oqcProcess);
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                return db.Database
                      .SqlQuery<ChartItemWithDate>("odi_ListIncrement @start, @end, @oqcProcess",
                      startParams, endParams, oqcParams)
                      .ToList();
            }
            catch (Exception ex)
            {
                return new List<ChartItemWithDate>();
            }
        }
        public List<ChartItem> odi_WOByCustomer(DateTime start, DateTime end, string area, string oqcProcess, bool isNG, ODIEntities db)
        {
            try
            {
                var areaParams = new SqlParameter("@area", area);
                var oqcParams = new SqlParameter("@oqcProcess", oqcProcess);
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                var isNGDayParams = new SqlParameter("@IsNG", isNG);
                return db.Database
                      .SqlQuery<ChartItem>("odi_WOByCustomer @start, @end, @area, @oqcProcess,@IsNG",
                      startParams, endParams, areaParams, oqcParams, isNGDayParams)
                      .ToList();
            }
            catch (Exception ex)
            {
                return new List<ChartItem>();
            }
        }
        public List<DefectionItem> odi_TotalByFail(DateTime start, DateTime end, string area, string oqcProcess, ODIEntities db)
        {
            try
            {
                var areaParams = new SqlParameter("@area", area);
                var oqcParams = new SqlParameter("@oqcProcess", oqcProcess);
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                return db.Database
                      .SqlQuery<DefectionItem>("odi_TotalByFail @start, @end, @area, @oqcProcess",
                      startParams, endParams, areaParams, oqcParams)
                      .ToList();
            }
            catch (Exception ex)
            {
                return new List<DefectionItem>();
            }
        }

        public List<ManPowerItem> odi_ManPower(DateTime start, DateTime end, string area, string oqcProcess, ODIEntities db)
        {
            try
            {
                var areaParams = new SqlParameter("@area", area);
                var oqcParams = new SqlParameter("@oqcProcess", oqcProcess);
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                return db.Database
                      .SqlQuery<ManPowerItem>("odi_ManPower @start, @end, @area, @oqcProcess",
                      startParams, endParams, areaParams, oqcParams)
                      .ToList();
            }
            catch (Exception ex)
            {
                return new List<ManPowerItem>();
            }
        }

        public List<ChartItemWithDate> odi_ListIncrementByStation(DateTime start, DateTime end, string oqcProcess, string filter, string value,string station, ODIEntities db)
        {
            try
            {
                var stationParams = new SqlParameter("@station", station);
                var filterParams = new SqlParameter("@filter", filter);
                var valueParams = new SqlParameter("@value", value);
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                var oqcParams = new SqlParameter("@oqcProcess", GetOQCProcess(oqcProcess));
                return db.Database
                      .SqlQuery<ChartItemWithDate>("odi_ListIncrementByStation @start, @end,@oqcProcess, @filter, @value, @station",
                      startParams, endParams, oqcParams,filterParams,valueParams, stationParams)
                      .ToList();
            }
            catch (Exception ex)
            {
                return new List<ChartItemWithDate>();
            }
        }
        private string GetOQCProcess(string oqcProcess)
        {
            if (string.IsNullOrEmpty(oqcProcess))
            {
                oqcProcess = "('OQC1','CSL','OQC2')";
            }
            else
            {
                string query = "(";
                if (!string.IsNullOrEmpty(oqcProcess))
                {
                    var stations = oqcProcess.Split(',');
                    foreach (var item in stations)
                    {
                        query += "'" + item + "',";
                    }
                    query = query.Substring(0, query.Length - 1);
                    query += ')';
                }
                oqcProcess = query;

            }
            return oqcProcess;
        }


        public List<ChartItem> odi_DefectionByCus(DateTime start, DateTime end, string oqcProcess, ODIEntities db)
        {
            try
            {
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                var oqcParams = new SqlParameter("@oqcProcess", GetOQCProcess(oqcProcess));
                return db.Database
                      .SqlQuery<ChartItem>("odi_DefectionByCus @start, @end,@oqcProcess",
                      startParams, endParams, oqcParams)
                      .ToList();
            }
            catch (Exception ex)
            {
                return new List<ChartItem>();
            }
        }

        public List<ChartItemWithDate> odi_Defection(DateTime start, DateTime end, string oqcProcess, string filter, string value, ODIEntities db)
        {
            try
            {
                var filterParams = new SqlParameter("@filter", filter);
                var valueParams = new SqlParameter("@value", value);
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                var oqcParams = new SqlParameter("@oqcProcess", GetOQCProcess(oqcProcess));
                return db.Database
                      .SqlQuery<ChartItemWithDate>("odi_Defection @start, @end,@oqcProcess, @filter, @value",
                      startParams, endParams, oqcParams, filterParams, valueParams)
                      .ToList();
            }
            catch (Exception ex)
            {
                return new List<ChartItemWithDate>();
            }
        }

        public List<ChartItemWithNGPhoto> odi_ListDefectionImageNG(DateTime start, DateTime end, string oqcProcess, ODIEntities db)
        {
            try
            {
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                var oqcParams = new SqlParameter("@oqcProcess", GetOQCProcess(oqcProcess));
                return db.Database
                      .SqlQuery<ChartItemWithNGPhoto>("odi_ListDefectionImageNG @start, @end,@oqcProcess",
                      startParams, endParams, oqcParams)
                      .ToList();
            }
            catch (Exception ex)
            {
                return new List<ChartItemWithNGPhoto>();
            }
        }

        public List<WOWithDate> odi_WOByDate(DateTime start, DateTime end, string oqcProcess, string filter, string value,bool IsNG, ODIEntities db)
        {
            try
            {
                var filterParams = new SqlParameter("@filter", filter);
                var valueParams = new SqlParameter("@value", value);
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                var oqcParams = new SqlParameter("@oqcProcess", GetOQCProcess(oqcProcess));
                var IsNGParams = new SqlParameter("@IsNG", IsNG);
                return db.Database
                      .SqlQuery<WOWithDate>("odi_WOByDate @start, @end,@oqcProcess, @filter, @value,@IsNG",
                      startParams, endParams, oqcParams, filterParams, valueParams, IsNGParams).ToList();
            }
            catch (Exception ex)
            {
                return new List<WOWithDate>();
            }
        }

        public List<ChartItemWithDate> odi_dataChartDailyNGRate(DateTime start, DateTime end, string oqcProcess, string filter, string value, ODIEntities db)
        {
            try
            {
                var filterParams = new SqlParameter("@filter", filter);
                var valueParams = new SqlParameter("@value", value);
                var startParams = new SqlParameter("@start", start);
                var endParams = new SqlParameter("@end", end);
                var oqcParams = new SqlParameter("@oqcProcess", GetOQCProcess(oqcProcess));
                return db.Database
                      .SqlQuery<ChartItemWithDate>("odi_dataChartDailyNGRate @start, @end,@oqcProcess, @filter, @value",
                      startParams, endParams, oqcParams, filterParams, valueParams).ToList();
            }
            catch (Exception ex)
            {
                return new List<ChartItemWithDate>();
            }
        }
    }
}
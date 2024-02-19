using FormProject.Database;
using FormProject.Extension;
using FormProject.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormProject.Controllers
{
    public class OQCController : Controller
    {
        // GET: OQC
        public ActionResult OQCChart()
        {
            ViewBag.Filter = Constants.OQCChart;


            return View();
        }

        public JsonResult LoadDailyPerformance(string area, string startDate, string endDate, string oqcProcess, string shift)
        {
            try
            {
                using (var db = new ODIEntities())
                {
                    List<ODI> list = new List<ODI>();
                    var start = DateTime.Parse(startDate);
                    var end = DateTime.Parse(endDate);
                    area = area.Trim();
                    var odiRes = new ODIResponsibility();
                    var dailyTotal = odiRes.odi_DailyPerformance(start, end, area, oqcProcess, shift, db);
                    return Json(new
                    {
                        dailyTotal = dailyTotal
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return Json(new
                {
                    status = e.Message.ToString()

                }, JsonRequestBehavior.AllowGet);
            }

        }

        Stopwatch stopwatch = new Stopwatch();
        public JsonResult LoadData(string area, string startDate, string endDate, string oqcProcess)
        {
            try
            {
                using (var db = new ODIEntities())
                {
                    stopwatch.Start();
                    var start = DateTime.Parse(startDate);
                    var end = DateTime.Parse(endDate);
                    area = area.Trim();
                    oqcProcess = oqcProcess.Trim();
                    var listCustomer = new List<string>();
                    if (area == Constants.All || string.IsNullOrEmpty(area))
                    {
                        listCustomer = db.Areas.Where(m => m.Area1 != Constants.All).Select(m => m.Customer).ToList();
                    }
                    else
                    {
                        listCustomer = db.Areas.Where(m => m.Area1 == area).Select(m => m.Customer).ToList();
                    }

                    //day/night
                    var odiRes = new ODIResponsibility();
                    var dayPerformance = odiRes.odi_DayNightPerformance(start, end, area, oqcProcess, Shift.Day, db);
                    var nightPerformance = odiRes.odi_DayNightPerformance(start, end, area, oqcProcess, Shift.Night, db);
                    stopwatch.Stop();
                    Debug.WriteLine("DayNight:" + stopwatch.ElapsedMilliseconds);

                    stopwatch.Start();
                    // daily performance
                    var dailyTotal = odiRes.odi_DailyPerformance(start, end, area, oqcProcess, "", db);
                    stopwatch.Stop();
                    Debug.WriteLine("Daily:" + stopwatch.ElapsedMilliseconds);
                    stopwatch.Start();
                    // Wo by customer
                    var woTotal = odiRes.odi_WOByCustomer(start, end, area, oqcProcess, false, db);
                    var woNG = odiRes.odi_WOByCustomer(start, end, area, oqcProcess, true, db);
                    stopwatch.Stop();
                    Debug.WriteLine("WoByCustomer:" + stopwatch.ElapsedMilliseconds);
                    stopwatch.Start();
                    // fail rate
                    var totalByFail = odiRes.odi_TotalByFail(start, end, area, oqcProcess, db);
                    stopwatch.Stop();
                    Debug.WriteLine("Fail rate:" + stopwatch.ElapsedMilliseconds);
                    stopwatch.Start();

                    // weekly
                    int diff = (7 + (start.DayOfWeek - DayOfWeek.Monday)) % 7;
                    var weekStartDate = start.AddDays(-1 * diff).Date;
                    var weekEndDate = DateTime.MinValue;
                    var listWeek = new List<WeeklyReview>();
                    var listByDay = odiRes.odi_WeeklyReview(start, end, area, oqcProcess, db);
                    while (weekEndDate < end)
                    {
                        weekEndDate = weekStartDate.AddDays(6);
                        var shownStartDate = weekStartDate < start ? start : weekStartDate;
                        var shownEndDate = weekEndDate > end ? end : weekEndDate;
                        Stopwatch watch = new Stopwatch();
                        watch.Start();
                        listWeek.Add(new WeeklyReview()
                        {
                            date = shownStartDate.ToShortDateString() + "-" + shownEndDate.ToShortDateString(),
                            listByCus = (from p in listByDay
                                         where p.DateOccur >= shownStartDate && p.DateOccur <= shownEndDate
                                         group p by p.Customer into g
                                         select new ChartItem
                                         {
                                             Customer = g.Key,
                                             TotalCheck = g.Sum(m => m.TotalCheck),
                                             TotalNG = g.Sum(m => m.TotalNG)
                                         }).ToList()
                        });
                        watch.Stop();
                        Debug.WriteLine("Each Week:" + watch.ElapsedMilliseconds);
                        weekStartDate = weekStartDate.AddDays(7);
                    }
                    stopwatch.Stop();
                    Debug.WriteLine("Weekly:" + stopwatch.ElapsedMilliseconds);

                    stopwatch.Start();
                    // man-power
                    var listByArea = odiRes.odi_ManPower(start, end, area, oqcProcess, db);
                    stopwatch.Stop();
                    Debug.WriteLine("ManPower:" + stopwatch.ElapsedMilliseconds);
                    return Json(new
                    {
                        dayPerformance = dayPerformance,
                        nightPerformance = nightPerformance,
                        dailyTotal = dailyTotal,
                        totalByFail = totalByFail,
                        listWeek = listWeek,
                        listByArea = listByArea,
                        listCustomer = listCustomer,
                        woTotal = woTotal,
                        woNG = woNG

                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return Json(new { status = "ERORR" }, JsonRequestBehavior.AllowGet);
            }

        }
        public JsonResult LoaDataMTDQuantity(string startDate, string endDate, string filter, string value, string chart_view, string station)
        {
            try
            {
                using (var db = new ODIEntities())
                {
                    Stopwatch stopwatch = new Stopwatch();
                    stopwatch.Start();
                    if (string.IsNullOrEmpty(chart_view))
                        chart_view = Option.DAY;
                    chart_view = chart_view.Trim();
                    var start = DateTime.Parse(startDate);
                    var end = DateTime.Parse(endDate);
                    var targetPPM = 0;
                    var target = db.TargetPPMs.Where(m => m.Area == "ALL").FirstOrDefault();
                    if (target != null)
                        targetPPM = target.Target;

                    if (filter == "Area")
                    {
                        target = db.TargetPPMs.Where(m => m.Area == value).FirstOrDefault();
                        if (target != null)
                            targetPPM = target.Target;
                    }

                    var odiRes = new ODIResponsibility();
                    if (value == "ALL") value = "";
                    var defectionList = odiRes.odi_Defection(start, end, station, filter, value, db);
                    var oneDay = TimeSpan.FromDays(1);
                    var listDefectionByDate = new List<DefectionByDate>();
                    var jpDefection = db.TypeNGs.ToList();
                    int maxNGTotal = 0;
                    int maxNG = 0;
                    foreach (var def in jpDefection)
                    {
                        var defByDate = new DefectionByDate();
                        defByDate.defection = def.TypeNG1;
                        defByDate.jpDefection = def.JP;
                        var listTotal = defectionList.Where(m => m.Defection.Trim() == def.TypeNG1.Trim()).ToList();
                        var listByDate = new List<IncrementalTimeLine>();
                        var totalNGInDef = defectionList.Where(m => m.Defection.Trim() == def.TypeNG1.Trim()).Sum(m => m.TotalNG);
                        if (totalNGInDef > maxNGTotal)
                            maxNGTotal = totalNGInDef;
                        var currentStartDayInTable = start;
                        var currentEndDayInTable = start;
                        if (chart_view == Option.WEEK)
                        {
                            currentStartDayInTable = start.StartOfWeek(DayOfWeek.Monday);
                            currentEndDayInTable = currentStartDayInTable.AddDays(6);
                            currentStartDayInTable = start;
                        }
                        else if (chart_view == Option.MONTH)
                        {
                            currentStartDayInTable = new DateTime(start.Year, start.Month, 1);
                            currentEndDayInTable = currentStartDayInTable.AddMonths(1).AddDays(-1);
                        }
                        else if (chart_view == Option.YEAR)
                        {
                            currentStartDayInTable = new DateTime(start.Year, 1, 1);
                            currentEndDayInTable = currentStartDayInTable.AddYears(1).AddDays(-1);
                        }

                        while (currentStartDayInTable <= end)
                        {
                            var totalCheck = listTotal.Where(m => m.DateOccur >= currentStartDayInTable && m.DateOccur <= currentEndDayInTable).Sum(m => m.TotalCheck);
                            var totalNG = listTotal.Where(m => m.DateOccur >= currentStartDayInTable && m.DateOccur <= currentEndDayInTable).Sum(m => m.TotalNG);
                            var ppm = totalCheck == 0 ? 0 : totalNG * 1000000 / totalCheck;
                            var incremental = new IncrementalTimeLine()
                            {
                                totalCheck = totalCheck,
                                totalNG = totalNG,
                                ppm = ppm,
                                date = currentStartDayInTable
                            };
                            if (totalNG > maxNG) maxNG = totalNG;
                            listByDate.Add(incremental);
                            if (chart_view == Option.WEEK)
                            {
                                currentStartDayInTable = currentEndDayInTable.AddDays(1);
                                currentEndDayInTable = currentStartDayInTable.AddDays(6);
                            }
                            else if (chart_view == Option.DAY)
                            {
                                currentStartDayInTable = currentStartDayInTable.AddDays(1);
                                currentEndDayInTable = currentStartDayInTable;
                            }
                            else if (chart_view == Option.MONTH)
                            {
                                currentStartDayInTable = currentStartDayInTable.AddMonths(1);
                                currentEndDayInTable = currentEndDayInTable.AddMonths(1).AddDays(-1);
                            }
                            else if (chart_view == Option.YEAR)
                            {
                                currentStartDayInTable = currentStartDayInTable.AddYears(1);
                                currentEndDayInTable = currentEndDayInTable.AddYears(1).AddDays(-1);
                            }


                        }

                        defByDate.list = listByDate;
                        listDefectionByDate.Add(defByDate);
                    }
                    var CSL = new StationByDate()
                    {
                        station = "CSL"
                    };
                    CSL.list = new List<ChartItemWithDate>();
                    var OQC = new StationByDate()
                    {
                        station = "OQC"

                    };
                    OQC.list = new List<ChartItemWithDate>();
                    var listIncrement = new List<ChartItemWithDate>();

                    var currentStartDay = start;
                    var currentEndDay = start;
                    if (chart_view == Option.WEEK)
                    {
                        currentStartDay = currentStartDay.StartOfWeek(DayOfWeek.Monday);
                        currentEndDay = currentStartDay.AddDays(6);
                        currentStartDay = start;
                    }
                    else if (chart_view == Option.MONTH)
                    {
                        currentStartDay = new DateTime(start.Year, start.Month, 1);
                        currentEndDay = currentStartDay.AddMonths(1).AddDays(-1);
                    }
                    else if (chart_view == Option.YEAR)
                    {
                        currentStartDay = new DateTime(start.Year, 1, 1);
                        currentEndDay = currentStartDay.AddYears(1).AddDays(-1);
                    }
                    var listIncrementCSL = odiRes.odi_ListIncrementByStation(start, end, station, filter, value, "CSL", db);
                    var listIncrementOQC = odiRes.odi_ListIncrementByStation(start, end, station, filter, value, "OQC", db);

                    while (currentStartDay <= end)
                    {
                        var cslByDate = new ChartItemWithDate()
                        {
                            TotalCheck = listIncrementCSL.Where(m => m.DateOccur >= currentStartDay && m.DateOccur <= currentEndDay).Sum(m => m.TotalCheck),
                            TotalNG = listIncrementCSL.Where(m => m.DateOccur >= currentStartDay && m.DateOccur <= currentEndDay).Sum(m => m.TotalNG)
                        };
                        CSL.list.Add(cslByDate);
                        var oqcByDate = new ChartItemWithDate()
                        {
                            TotalCheck = listIncrementOQC.Where(m => m.DateOccur >= currentStartDay && m.DateOccur <= currentEndDay).Sum(m => m.TotalCheck),
                            TotalNG = listIncrementOQC.Where(m => m.DateOccur >= currentStartDay && m.DateOccur <= currentEndDay).Sum(m => m.TotalNG)
                        };
                        OQC.list.Add(oqcByDate);

                        listIncrement.Add(new ChartItemWithDate()
                        {
                            TotalCheck = cslByDate.TotalCheck + oqcByDate.TotalCheck,
                            TotalNG = cslByDate.TotalNG + oqcByDate.TotalNG,
                            DateOccur = currentStartDay,
                        });
                        if (chart_view == Option.WEEK)
                        {
                            currentStartDay = currentEndDay.AddDays(1);
                            currentEndDay = currentStartDay.AddDays(6);
                        }
                        else if (chart_view == Option.DAY)
                        {
                            currentStartDay = currentStartDay.AddDays(1);
                            currentEndDay = currentStartDay;
                        }
                        else if (chart_view == Option.MONTH)
                        {
                            currentStartDay = currentStartDay.AddMonths(1);
                            currentEndDay = currentStartDay.AddMonths(1).AddDays(-1);
                        }
                        else if (chart_view == Option.YEAR)
                        {
                            currentStartDay = currentStartDay.AddYears(1);
                            currentEndDay = currentStartDay.AddYears(1).AddDays(-1);
                        }

                    }

                    stopwatch.Stop();
                    Debug.WriteLine("LoaDataMTDQuantity:" + stopwatch.ElapsedMilliseconds);
                    return Json(new
                    {
                        listIncrement = listIncrement,
                        listDefectionByDate = listDefectionByDate,
                        OQC = OQC,
                        CSL = CSL,
                        maxNG = maxNG,
                        maxNGTotal = maxNGTotal,
                        targetPPM = targetPPM
                    }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception e)
            {

                return Json(new
                {
                    error = e.Message.ToString()
                }, JsonRequestBehavior.AllowGet);
            }


        }
        public JsonResult LoadDataAeaOverview(string startDate, string endDate, string oqcProcess)
        {

            try
            {

                using (var db = new ODIEntities())
                {
                    stopwatch.Start();
                    var start = DateTime.Parse(startDate);
                    var end = DateTime.Parse(endDate);
                    var odiRes = new ODIResponsibility();
                    var listArea = odiRes.odi_ListArea(start, end, oqcProcess, db);
                    var listIncrements = odiRes.odi_ListIncrement(start, end, oqcProcess, db);
                    var listCustomer = db.Areas.Where(m => m.Area1 != Constants.All).GroupBy(m => m.Area1).Select(m => new
                    {
                        Area = m.Key,
                        list = m.ToList()
                    }).ToList();
                    stopwatch.Stop();
                    Debug.WriteLine("LoadDataAeaOverview:" + stopwatch.ElapsedMilliseconds);
                    return Json(new
                    {
                        listArea = listArea,
                        listIncrements = listIncrements,
                        listCustomer = listCustomer
                    }, JsonRequestBehavior.AllowGet);
                }


            }
            catch (Exception e)
            {
                return Json(new
                {
                    status = e.Message.ToString()

                }, JsonRequestBehavior.AllowGet);
            }


        }
        public ActionResult OQCChartAreaOverview()
        {
            ViewBag.Filter = Constants.OQCChartAreaOverview;
            return View();
        }
        public JsonResult LoaDataChartDefection(string startDate, string endDate, string filter, string value, string station)
        {
            try
            {
                using (var db = new ODIEntities())
                {
                    Stopwatch stopwatch = new Stopwatch();
                    stopwatch.Start();
                    var start = DateTime.Parse(startDate);
                    var end = DateTime.Parse(endDate);
                    var targets = db.TargetPPMs.ToList();
                    var odiRes = new ODIResponsibility();
                    var listData = odiRes.odi_DefectionByCus(start, end, station, db);
                    var listCustomer = db.Areas.Where(m => m.Area1 != Constants.All).GroupBy(m => m.Area1).Select(m => new { name = m.Key, list = m.ToList() }).ToList();
                    var listNGPhoto = odiRes.odi_ListDefectionImageNG(start, end, station, db);
                    stopwatch.Stop();
                    Debug.WriteLine("LoaDataChartDefection:" + stopwatch.ElapsedMilliseconds);
                    return Json(new
                    {
                        listData = listData,
                        listCustomer = listCustomer,
                        targets = targets,
                        listNGPhoto = listNGPhoto
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return Json(new
                {
                    status = e.Message.ToString()

                }, JsonRequestBehavior.AllowGet);

            }


        }

        public JsonResult LoadDataPerformance(string startDate, string endDate, string filter, string value, string chart_view, string station)
        {
            try
            {
                using (var db = new ODIEntities())
                {

                    if (string.IsNullOrEmpty(chart_view))
                        chart_view = Option.DAY;
                    chart_view = chart_view.Trim();
                    List<ODI> list = new List<ODI>();
                    var start = DateTime.Parse(startDate);
                    var end = DateTime.Parse(endDate);
                    var odiRes = new ODIResponsibility();

                    var listCustomer = new List<string>();
                    if (filter == "Area" && !string.IsNullOrEmpty(value))
                    {
                        listCustomer = db.Areas.Where(m => m.Area1 == value).Select(m => m.Customer).ToList();
                    }
                    else
                    {
                        listCustomer = db.Areas.Where(m => m.Area1 != Constants.All).Select(m => m.Customer).ToList();
                    }
                    var dataChartDaily = odiRes.odi_ListIncrementByStation(start, end, station, filter, value, "", db);
                    var listIncrement = new List<ChartItemWithDate>();
                    var listIncrementByWO = new List<ChartItemWithDate>();
                    var dataChartDailyNGRate = new List<WeeklyReview>();
                    var listWoCheck = odiRes.odi_WOByDate(start, end, station, filter, value, false, db);
                    var listWoNG = odiRes.odi_WOByDate(start, end, station, filter, value, true, db);
                    var listDailyNGRate = odiRes.odi_dataChartDailyNGRate(start, end, station, filter, value, db);

                    var currentStartDay = start;
                    var currentEndDay = start;
                    if (chart_view == Option.WEEK)
                    {
                        currentStartDay = currentStartDay.StartOfWeek(DayOfWeek.Monday);
                        currentEndDay = currentStartDay.AddDays(6);
                        currentStartDay = start;
                    }
                    else if (chart_view == Option.MONTH)
                    {
                        currentStartDay = new DateTime(start.Year, start.Month, 1);
                        currentEndDay = currentStartDay.AddMonths(1).AddDays(-1);
                    }
                    else if (chart_view == Option.YEAR)
                    {
                        currentStartDay = new DateTime(start.Year, 1, 1);
                        currentEndDay = currentStartDay.AddYears(1).AddDays(-1);
                    }
                    Stopwatch stopwatch = new Stopwatch();
                    stopwatch.Start();

                    while (currentStartDay <= end)
                    {
                        var list1 = listDailyNGRate.Where(m => m.DateOccur >= currentStartDay && m.DateOccur <= currentEndDay).Select(m =>
                            new ChartItem()
                            {
                                TotalCheck = m.TotalCheck,
                                TotalNG = m.TotalNG,
                                Customer = m.Customer
                            }).ToList();
                        dataChartDailyNGRate.Add(new WeeklyReview()
                        {
                            date = currentStartDay.ToString("yyyy-MM-dd"),
                            listByCus = list1
                        });
                        foreach(var item in list1)
                        {
                            if(item.Customer == "YASKAWA")
                            {
                                Console.Write("");
                            }
                        }
                        listIncrementByWO.Add(new ChartItemWithDate()
                        {
                            TotalCheck = listWoCheck.Where(m => m.DateOccur >= currentStartDay && m.DateOccur <= currentEndDay).GroupBy(m => m.WO).Count(),
                            TotalNG = listWoNG.Where(m => m.DateOccur >= currentStartDay && m.DateOccur <= currentEndDay).GroupBy(m => m.WO).Count(),
                            DateOccur = currentStartDay,
                        });

                        listIncrement.Add(new ChartItemWithDate()
                        {
                            TotalCheck = dataChartDaily.Where(m => m.DateOccur >= currentStartDay && m.DateOccur <= currentEndDay).Sum(m => m.TotalCheck),
                            TotalNG = dataChartDaily.Where(m => m.DateOccur >= currentStartDay && m.DateOccur <= currentEndDay).Sum(m => m.TotalNG),
                            DateOccur = currentStartDay,
                        });
                        if (chart_view == Option.WEEK)
                        {
                            currentStartDay = currentEndDay.AddDays(1);
                            currentEndDay = currentStartDay.AddDays(6);
                        }
                        else if (chart_view == Option.DAY)
                        {
                            currentStartDay = currentStartDay.AddDays(1);
                            currentEndDay = currentStartDay;
                        }
                        else if (chart_view == Option.MONTH)
                        {
                            currentStartDay = currentStartDay.AddMonths(1);
                            currentEndDay = currentStartDay.AddMonths(1).AddDays(-1);
                        }
                        else if (chart_view == Option.YEAR)
                        {
                            currentStartDay = currentStartDay.AddYears(1);
                            currentEndDay = currentStartDay.AddYears(1).AddDays(-1);
                        }

                    }
                    stopwatch.Stop();
                    Debug.WriteLine("WOQty:" + stopwatch.ElapsedMilliseconds);

                    return Json(new
                    {
                        listIncrement = listIncrement,
                        listIncrementByWO = listIncrementByWO,
                        dataChartDailyNGRate = dataChartDailyNGRate,
                        listCustomer = listCustomer

                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {

                return Json(new
                {
                    error = e.Message.ToString()
                }, JsonRequestBehavior.AllowGet);
            }


        }

        public ActionResult MTDQuantity()
        {
            ViewBag.Filter = Constants.MTDQuantity;
            addFilter();
            return View();
        }
        public ActionResult OQCChartPerformance()
        {
            ViewBag.Filter = Constants.OQCChartPerformance;
            addFilter();
            return View();
        }
        public ActionResult OQCChartDefection()
        {
            ViewBag.Filter = Constants.OQCChartDefection;
            addFilter();
            return View();
        }

        public JsonResult Load()
        {
            try
            {
                using (var db = new ClaimFormEntities())
                {
                    var countNight = db.ODIs.GroupBy(m => m.Shift == "Night").Select(m =>
                                new
                                {

                                    totalCheck = m.Sum(w => w.CheckNumber),
                                    totalNG = m.Sum(w => w.NumberNG)
                                });
                    var countDay = db.ODIs.GroupBy(m => m.Shift == "Day").Select(m =>
                              new
                              {

                                  totalCheck = m.Sum(w => w.CheckNumber),
                                  totalNG = m.Sum(w => w.NumberNG)
                              });

                    return Json(new
                    {
                        body = ""

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

        private void addFilter()
        {
            using (var db = new ODIEntities())
            {
                ViewBag.Model = db.ODIs.Select(m => m.ModelName).ToList();
                ViewBag.Customer = db.Areas.Select(m => m.Customer).ToList();
                ViewBag.GroupModel = db.ODIs.Select(r => r.GroupModel).ToList();
            }
        }

    }


}
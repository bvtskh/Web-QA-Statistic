using FormProject.Controllers;
using FormProject.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormProject.Models
{
    public class ChartItem
    {
        public int TotalCheck { get; set; }
        public int TotalNG { get; set; }
        public string Customer { get; set; }
        public string Area { get; set; }
        public string Defection { get; set; }
        public int TotalWoReceived { get; set; }
        public string NG_Photo { get; set; }
    }
    public class ChartItemWithNGPhoto
    {
        public string Customer { get; set; }
        public string Defection { get; set; }
        public string NG_Photo { get; set; }
        public string NGPhoto
        {
            get
            {
                return Utils.DownloadImageNG(NG_Photo);
            }
        }
    }
  
    public class ManPowerItem
    {
        public int TotalCheck { get; set; }
        public int TotalNG { get; set; }
        public string Area { get; set; }
        public string Inspector { get; set; }
    }

    public class DefectionItem
    {
        public string defection { get; set; }
        public int total { get; set; }
    }
    public class WOWithDate
    {
        public DateTime DateOccur { get; set; }
        public string DateStr
        {
            get
            {
                return DateOccur.ToString("yyyy-MM-dd");
            }
        }
        public string WO { get; set; }
    }

    public class ChartItemWithDate
    {
        public DateTime DateOccur { get; set; }
        public string DateStr
        {
            get
            {
                return DateOccur.ToString("yyyy-MM-dd");
            }
        }
        public int TotalCheck { get; set; }
        public int TotalNG { get; set; }
        public string Customer { get; set; }
        public string Area { get; set; }
        public string Defection { get; set; }
    }
    public class WeeklyReview
    {
        public string date { get; set; }
        public List<ChartItem> listByCus { get; set; }
    }
    public class ChartDailyPerformance
    {
        public string label { get; set; }
        public float y { get; set; }
    }
    public class ChartDailyPerformanceViewTable
    {
        public string customer { get; set; }
        public float totalCheck { get; set; }
        public float totalNG { get; set; }
        public float PPM { get; set; }
        public Week week { get; set; }

    }
    public class Week
    {
        public DateTime start { get; set; }
        public DateTime end { get; set; }
        public string startStr { get => start.ToShortDateString(); }
        public string endStr { get => end.ToShortDateString(); }
        public float totalCheck { get; set; }
        public float totalNG { get; set; }
        public float PPM { get; set; }
    }


    public class IncrementalTimeLine
    {
        public DateTime date { get; set; }
        public string dateStr { get; set; }
        public string dateIndex { get => date.ToString("dd"); }
        public float ppm { get; set; }
        public int totalCheck { get; set; }
        public int totalNG { get; set; }
        public int deviation { get => (50 - (int)ppm); }
    }

    public class DefectionByDate
    {
        public string defection { get; set; }
        public string jpDefection { get; set; }
        public List<IncrementalTimeLine> list { get; set; }
    }
    public class StationByDate
    {
        public string station { get; set; }
        public List<ChartItemWithDate> list { get; set; }
    }

    public class NGRateModel
    {
        public string customer { get; set; }
        public List<ChartDailyPerformance> list { get; set; }
    }

}
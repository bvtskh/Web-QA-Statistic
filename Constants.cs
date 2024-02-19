using FormProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace FormProject
{
    public static class Constants
    {
        public static string Role_Admin = "Admin";
        public static string Result_OK = "OK";
        public static int Status_Init = 1;
        public static int Status_Create = 2;
        public static string Action_Reject = "Reject";
        public static string Action_Save = "Save";
        public static string Action_Draft = "Draft";
        public static string Action_Approved = "Approve";

        public static string Filter_Draft = "Filter_Draft";
        public static string Filter_MyClaim = "Filter_MyClaim";
        public static string Filter_WaitingMe = "Filter_WaitingMe";
        public static string Filter_ClaimView = "Filter_ClaimView";
        public static string Claim_Chart = "Claim_Chart";
        public static string OQCChart = "OQCChart";
        public static string OQCChartAreaOverview = "OQCChartAreaOverview";
        public static string MTDQuantity = "MTDQuantity";
        public static string OQCChartPerformance = "OQCChartPerformance";
        public static string OQCChartDefection = "OQCChartDefection";
        public static string All = "ALL";
        public static int PageSize = 15;
        public static string MAIL = "hoanht@umcvn.com";
        public static string PASS = "Umcvn@123";
        public static string SUBJECT = "Gửi mail xác thực CLAIM";
        public static string SESSION_USER = "User";

        public static int STATUS_SUCCESS = 0;
        public static int STATUS_ERROR = -1;
        public static int NUMBER_PAGE_VISIBALE = 10;
        public static int DUE_DATE = 3;
        public static int STATUS_OPEN = 1;
        public static int STATUS_CLOSE = 2;
        public static string CONTENT_OUTLOOK(string url, string email, string claimNo)
        {
            return @"<html>" +
 "<body style='font-family: verdana; font-size: 14px;'>" +
 "<p>Dear user,</p>" +
 "<p>There is an update request report to the cause- corrective action for the<span style='background-color:yellow;'> " + claimNo + "</span> (control number) sent to you.</p>" +
 "<p>Click under link to access to the deliverable, submit and review it for approval or rejection.</p> " +
 "<p> " + url +
 "<p>If you need additional information or details, do not hesitate to contact:</p>" +
 "<p>Your Administrator: " + email + "</p>" +
 "<br/>" +
 "<p>Có một yêu cầu cập nhật cho nguyên nhân và hành động khắc phục ngăn ngừa cho<span style='background-color:yellow;'> " + claimNo + "</span> đã được gửi cho bạn.</p>" +
 "<p>Nhấp vào liên kết dưới để truy cập vào có thể đệ trình, gửi và xem xét, để phê duyệt hoặc từ chối nó.</p>" +
 "<p> " + url +
 "<p>Nếu bạn cần thêm thông tin hoặc chi tiết, đừng ngần ngại liên hệ: </p>" +
 "<p>Địa chỉ của người khởi tạo: " + email + "</p>" +
 "</body>" +
 "</html>";
        }
    }
    public static class FourM
    {
        public static string[] FOURM = {"Man_cầmnắm","Man_kỹ năng","Man_tuânthủ",
"Method_cầm nắm",
"Method_Sửa chữa",
"Method_Cắm tay",
"Method_Layout",
"Method_Lắp ráp",
"Material_PCB",
"Material_hóa chất",
"Material_lk điện tử",
"Material_lk cơ khí",
"Machine_Flow",
"Machine_Robot hàn",
"Machine_Mount",
"Machine_AI",
"Machine_reflow",
"Machine_Printer",
"Machine_coating",
"Machine_ICT",
"Machine_FCT",
"Machine_cắt",
"Machine_JIG/Fixture",
"Machine_Other"};

    }

    public static class DocumentType
    {
        public static string BANVE = "Bản vẽ　図面";
        public static string BOM = "BOM";
        public static string SODO_QC = "Sơ đồ QC QC Chart";
        public static string FMEA = "FMEA";
        public static string CONTROL_PLAN = "Control plan";
        public static string QUYTRINH = "Quy trình　規程";
        public static string TIEUCHUANTHAOTAC = "Tiêu chuẩn thao tác　作業標準書";
        public static string KHAC = "Khác　その他";
        public static string ALL = "ALL";
    }

    public static class FormType
    {
        public static string FIVE_WHY = "5Why";
        public static string REPORT = "Report";
    }
    public static class Area
    {
        public static string AUTO = "AUTO";
        public static string PICKUP = "PICKUP";
        public static string ID = "ID";
        public static string OA = "OA";
        public static string ALL = "ALL";
    }
    public static class Station
    {
        public static string CSL = "CSL";
        public static string OQC1 = "OQC1";
        public static string OQC2 = "OQC2";
        public static string ALL = "ALL";
    }
    public static class Shift
    {
        public static string Day = "Day";
        public static string Night = "Night";

    }
    public static class Option
    {
        public static string DAY = "Ngày";
        public static string WEEK = "Tuần";
        public static string MONTH = "Tháng";
        public static string YEAR = "Năm";
    }
    public static class SUBJECT
    {
        public static string[] LIST =
        {
            "Kênh linh kiện 部品浮き",
"Nhầm lk部品間違い",
"Ngược linh kiên逆搭載",
"Bong , vỡ linh kiệnクラック、破損",
"Lệch linh kiện位置ズレ",
"Thiếu linh kiện ( mất linh kiện)欠品",
"Thừa linh kiện部品剰余",
"NG linh kiện, biến dạng 部品変形・ 部品NG",
"BIẾN DẠNG LINH KIỆN (部品変形）",
"Lật linh kiện ( 部品逆面搭載)",
"Thiếc phủ kín chânリード見えない",
"Oxi hóa酸化",
"Dài chân リード長い",
"Bong Pattern パターン剥がれ",
"Dính thiếc （はんだ屑付着）",
"Nối chânショット",
"Hàn giảイモはんだ",
"Thiếu Thiếc （はんだ少）",
"Thừa Thiếc （はんだ過剰）",
"Bi thiếc （はんだボール付着）",
"NG dấu ngày tháng 捺印不良",
"NG barcode( dính mực  ,mờ mã vạch , nhòe mã vạch ）にじみ",
"Nhầm vị trí(搭載位置間違い）",
"Lỏng ốc(ネジ緩み）",
"Nứt vỡ  bản mạch(クラック,破損）",
"Phồng bản mạch ミズリング",
"Không marking (マーキング無し）",
"Nhầm Model （モデル混入）",
"Thừa số lượng （梱包台数過剰）",
"Thiếu số lượng （梱包台数不足）",
"Dính Flux （フラックス付着）",
"Dị Vật （異物付着）",
"NHẦM HISTORY,FW (HISTORY,FW間違い)",
"Lỗi packing(梱包不具合）",
"Tràn keo , coating(接着剤はみだし）",
"Khác ( cao dây , xước ,cháy dây,rách linh kiện) (他不良）"

        };
    }

}

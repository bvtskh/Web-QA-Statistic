using FluentFTP;
using FormProject.Database;
using FormProject.Models;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using OfficeOpenXml.Table;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Runtime.Remoting.Contexts;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FormProject.Controllers
{
    public static class DateTimeExtensions
    {
        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = dt.DayOfWeek - startOfWeek;
            if (diff < 0)
            {
                diff += 7;
            }
            return dt.AddDays(-1 * diff).Date;
        }
    }

    public static class Utils
    {
        public static string DownloadImageNG(string NG_Photo)
        {
            try
            {
                if (string.IsNullOrEmpty(NG_Photo)) return "";
                var path = Bet.Util.Config.GetValue("folder") + @"Uploads\ImageNG\";
                string pathLocal = @"\Uploads\ImageNG\" + NG_Photo;
                if (System.IO.File.Exists(path + NG_Photo))
                    return pathLocal;
               // var localPath = Utils.DownloadFile("172.28.10.17", @"VN\U34811", "hoan200794", path + NG_Photo, "/OQC/" + NG_Photo);
                var localPath = Utils.DownloadFile("172.28.10.17", @"VN\share", "0FFP@ssw0rd", path + NG_Photo, "/OQC/" + NG_Photo);
                return pathLocal;
            }
            catch (Exception e)
            {
                return "";
            }

        }
        public static IEnumerable<Tuple<T, int>> Rank<T>(this IEnumerable<T> source)
        {
            var query = source.GroupBy(x => x)
                .OrderByDescending(x => x.Key);

            var rank = 1;
            foreach (var group in query)
            {
                var groupRank = rank;
                foreach (var item in group)
                {
                    yield return Tuple.Create(item, groupRank);
                    rank++;
                }
            }
        }
        public static string DownloadFile(string host, string username, string password, string localPath, string remotePath)
        {
            using (var ftp = new FtpClient(host, username, password))
            {
                ftp.Connect();
                ftp.DownloadFile(localPath, remotePath, FtpLocalExists.Overwrite, FtpVerify.Retry);
                return localPath;
            }
        }
        public static int GetIso8601WeekOfYear(DateTime time)
        {
            // Seriously cheat.  If its Monday, Tuesday or Wednesday, then it'll 
            // be the same week# as whatever Thursday, Friday or Saturday are,
            // and we always get those right
            DayOfWeek day = CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(time);
            if (day >= DayOfWeek.Monday && day <= DayOfWeek.Wednesday)
            {
                time = time.AddDays(3);
            }

            // Return the week of our adjusted day
            return CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(time, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
        }
        public static string ConvertViewToString(string viewName, object model, ViewDataDictionary ViewData, ControllerContext ControllerContext)
        {
            ViewData.Model = model;
            using (StringWriter writer = new StringWriter())
            {
                ViewEngineResult vResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
                ViewContext vContext = new ViewContext(ControllerContext, vResult.View, ViewData, new TempDataDictionary(), writer);
                vResult.View.Render(vContext, writer);
                return writer.ToString();
            }
        }
        public static string ToDateString(this DateTime dateTime)
        {
            return dateTime.ToString("yyyy-MM-dd");
        }
        public static string UploadImage(HttpPostedFileBase file, string FileName, string name, Controller context)
        {
            try
            {
                string generateFileName = DateTime.Now.ToString().MD5Hash();
                string extension = Path.GetExtension(FileName);
                FileName = name + "_" + generateFileName + extension;
                string path = Path.Combine(context.Server.MapPath(context.Url.Content("~/Uploads/ImageNG")), FileName);
                Image image = Image.FromStream(file.InputStream, true, true);
                image = ResizeByWidth(image, 500);
                image.Save(path, ImageFormat.Jpeg);
                return string.Concat("/Uploads/ImageNG/", FileName);
            }
            catch (Exception)
            {
                return "";
            }

        }
        public static void TrackUploads(string path)
        {

            FileSystemWatcher watcher = new FileSystemWatcher();
            watcher.Path = path;
            watcher.Filter = "*.*";
            watcher.Created += OnChanged;
            watcher.EnableRaisingEvents = true;
        }

        private static void OnChanged(object sender, FileSystemEventArgs e)
        {
            //Image image = ResizeByWidth(Image.FromFile(e.FullPath), 200);
            //File.Delete(e.FullPath);
            //image.Save(e.FullPath, ImageFormat.Jpeg);
            //Console.WriteLine($"File: {e.FullPath} {e.ChangeType}");
        }
        public static Image ResizeByWidth(Image img, int width)
        {
            // lấy chiều rộng và chiều cao ban đầu của ảnh
            int originalW = img.Width;
            int originalH = img.Height;

            // lấy chiều rộng và chiều cao mới tương ứng với chiều rộng truyền vào của ảnh (nó sẽ giúp ảnh của chúng ta sau khi resize vần giứ được độ cân đối của tấm ảnh
            int resizedW = originalW / 2;
            int resizedH = (originalH * resizedW) / originalW;

            // tạo một Bitmap có kích thước tương ứng với chiều rộng và chiều cao mới
            Bitmap bmp = new Bitmap(resizedW, resizedH);

            // tạo mới một đối tượng từ Bitmap
            Graphics graphic = Graphics.FromImage((Image)bmp);
            graphic.InterpolationMode = InterpolationMode.HighQualityBilinear;

            // vẽ lại ảnh với kích thước mới
            graphic.DrawImage(img, 0, 0, resizedW, resizedH);

            // gải phóng resource cho đối tượng graphic
            graphic.Dispose();

            // trả về anh sau khi đã resize
            return (Image)bmp;
        }
    }


    public static class Encrypt
    {
       
        public static string MD5Hash(this string text)
        {
            MD5 md5 = new MD5CryptoServiceProvider();

            //compute hash from the bytes of text  
            md5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(text));

            //get hash result after compute it  
            byte[] result = md5.Hash;

            StringBuilder strBuilder = new StringBuilder();
            for (int i = 0; i < result.Length; i++)
            {
                //change it into 2 hexadecimal digits  
                //for each byte  
                strBuilder.Append(result[i].ToString("x2"));
            }

            return strBuilder.ToString();
        }

    }
    public static class Outlook
    {
       
        public static int SendMail(string to, string subject, string body, string mailcc= "")
        {
            try
            {
                MailMessage mailMessage = new MailMessage();
                SmtpClient smtpClient = new SmtpClient
                {
                    EnableSsl = true,
                    Host = "smtp.office365.com",
                    Port = 587,
                    UseDefaultCredentials = false,
                    DeliveryMethod = SmtpDeliveryMethod.Network,

                    TargetName = "STARTTLS/smtp.office365.com",
                    Credentials = new NetworkCredential(Constants.MAIL, Constants.PASS)
                };
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                mailMessage.From = new MailAddress(Constants.MAIL);
                mailMessage.To.Add(to);
                mailMessage.Subject = subject;
                mailMessage.Body = body;
                mailMessage.IsBodyHtml = true;
                if (!string.IsNullOrEmpty(mailcc))
                {
                    mailMessage.CC.Add(new MailAddress(mailcc));
                }
                Thread thread = new Thread(delegate ()
                {
                    smtpClient.SendMailAsync(mailMessage);
                })
                {
                    IsBackground = true
                };
                thread.Start();
                return Constants.STATUS_SUCCESS;
            }
            catch (Exception)
            {
                return Constants.STATUS_ERROR;
            }
        }
    }

    public static class ExportUtils
    {
        private static async Task<int> BindingFormatForExcel(ExcelWorksheet worksheet, List<ClaimExcelModel> listItems)
        {
            // Set default width cho tất cả column
            //worksheet.DefaultColWidth = 50;
            // Tự động xuống hàng khi text quá dài
            worksheet.Cells.Style.WrapText = true;
            // Tạo header
            worksheet.Cells[1, 1].Value = Resource.Index;
            worksheet.Cells[1, 2].Value = Resource.Field_No;
            worksheet.Cells[1, 3].Value = Resource.Field_Create_date;
            worksheet.Cells[1, 4].Value = Resource.Field_Customer;
            worksheet.Cells[1, 5].Value = Resource.Field_Type;
            worksheet.Cells[1, 6].Value = Resource.Field_Model;
            worksheet.Cells[1, 7].Value = Resource.Field_Group_Model;
            worksheet.Cells[1, 8].Value = Resource.Field_Subject;
            worksheet.Cells[1, 9].Value = Resource.Field_Due_date;
            worksheet.Cells[1, 10].Value = Resource.Field_Status;
            worksheet.Cells[1, 11].Value = Resource.Field_Classify4M;
            worksheet.Cells[1, 12].Value = Resource.Field_Type_Form;
            worksheet.Cells[1, 13].Value = Resource.Field_Number_NG;


            // Lấy range vào tạo format cho range đó ở đây là từ A1 tới D1
            using (var range = worksheet.Cells["A1:M1"])
            {
                range.AutoFitColumns(20);
                // Set PatternType
                range.Style.Fill.PatternType = ExcelFillStyle.DarkGray;
                // Set Màu cho Background
                range.Style.Fill.BackgroundColor.SetColor(Color.Aqua);
                // Canh giữa cho các text
                range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                // Set Font cho text  trong Range hiện tại
                range.Style.Font.SetFromFont(new Font("Arial", 10));
                // Set Border
                range.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
                // Set màu ch Border
                range.Style.Border.Bottom.Color.SetColor(Color.Blue);
            }
            ClaimFormEntities db = new ClaimFormEntities();
            List<Process> process = db.Processes.ToList();
            await Task.Run(() => {
                // Đỗ dữ liệu từ list vào 
                for (int i = 0; i < listItems.Count; i++)
                {
                    var item = listItems[i];
                    var status = process.Where(m => m.Id == item.Status_approval).FirstOrDefault();
                    string status_str = status != null ? status.DisplayName : "";
                    worksheet.Cells[i + 2, 1].Value = item.RowNumberAll;
                    worksheet.Cells[i + 2, 2].Value = item.No;
                    worksheet.Cells[i + 2, 3].Value = string.Format("{0:d}", item.Create_date);
                    worksheet.Cells[i + 2, 4].Value = item.Customer;
                    worksheet.Cells[i + 2, 5].Value = item.Type;
                    worksheet.Cells[i + 2, 6].Value = item.Model_name;
                    worksheet.Cells[i + 2, 7].Value = item.Model_group;
                    worksheet.Cells[i + 2, 8].Value = item.Subject;
                    if(item.Due_date != null)
                    {
                        DateTime due_date = (DateTime)item.Due_date;
                        if(due_date.Date < DateTime.Now.Date)
                        {
                            worksheet.Cells[i + 2, 9].Style.Font.Color.SetColor(Color.Red);
                        }
                        worksheet.Cells[i + 2, 9].Value = string.Format("{0:d}", item.Due_date);
                    }
                    else
                    {
                        worksheet.Cells[i + 2, 9].Value = "";
                    }
                   
                    worksheet.Cells[i + 2, 10].Value = status_str;
                    worksheet.Cells[i + 2, 11].Value = item.Classify4M;
                    worksheet.Cells[i + 2, 12].Value = item.Type_Form;
                    worksheet.Cells[i + 2, 13].Value = item.Number_NG;
                }
            });
           return 1;
        }
        public static async Task<Stream> CreateExcelFile(Stream stream = null, List<ClaimExcelModel> list = null)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var excelPackage = new ExcelPackage(stream ?? new MemoryStream()))
            {
                // Tạo author cho file Excel
                excelPackage.Workbook.Properties.Author = "Hanker";
                // Tạo title cho file Excel
                excelPackage.Workbook.Properties.Title = "EPP test background";
                // thêm tí comments vào làm màu 
                excelPackage.Workbook.Properties.Comments = "This is my fucking generated Comments";
                // Add Sheet vào file Excel
                excelPackage.Workbook.Worksheets.Add("First Sheet");
                // Lấy Sheet bạn vừa mới tạo ra để thao tác 
                var workSheet = excelPackage.Workbook.Worksheets[0];
                // Đổ data vào Excel file
               // workSheet.Cells[1, 1].LoadFromCollection(list, true, TableStyles.Dark9);
                 await BindingFormatForExcel(workSheet, list);
                excelPackage.Save();
                return excelPackage.Stream;
            }
        }
    }
}
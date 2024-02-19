//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace FormProject.Database
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;

    public partial class Notice
    {
        public int Id { get; set; }
        public string Reciever { get; set; }
        public string NoticeContent { get; set; }
        public Nullable<int> ClaimId { get; set; }
        public Nullable<System.DateTime> SendDate { get; set; }
        public Nullable<int> IsRead { get; set; }
    
        public virtual Claim Claim { get; set; }
        public virtual User User { get; set; }

        public String SendDateStr
        {
            get
            {
                if(SendDate is DateTime dt)
                {
                    return dt.ToString("f", DateTimeFormatInfo.InvariantInfo);
                } else
                {
                    return "";
                }
            }
        }
    }
}
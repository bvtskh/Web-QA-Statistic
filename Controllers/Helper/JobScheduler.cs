using FormProject.Controllers.Database;
using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormProject.Controllers.Helper
{
    public class JobScheduler
    {
        public static void Start()

        {

            IScheduler scheduler = StdSchedulerFactory.GetDefaultScheduler();

            scheduler.Start();
            IJobDetail job = JobBuilder.Create<EmailJob>().Build();
            ITrigger trigger = TriggerBuilder.Create()
                .WithDailyTimeIntervalSchedule
                  (s =>
                     s.WithIntervalInHours(24)
                    .OnEveryDay()
                    .StartingDailyAt(TimeOfDay.HourAndMinuteOfDay(8, 0))
                  )
                .Build();
            scheduler.ScheduleJob(job, trigger);

        }
        public class EmailJob : IJob

        {

            public void Execute(IJobExecutionContext context)

            {
                try
                {
                    ClaimDbManager claimManager = new ClaimDbManager();
                    UserDbManager userManager = new UserDbManager();
                    var listOverDate = claimManager.GetClaimOverDate();
                    if (listOverDate != null)
                    {
                        foreach (var claim in listOverDate)
                        {
                            claim.SetProcess();
                            claim.SetStep();
                            foreach (var receiverId in claim.NextStep.Action_by)
                            {
                                var receiver = userManager.GetUserById(receiverId);
                                var user = userManager.GetUserById(claim.Modify_by);

                                var content = Constants.CONTENT_OUTLOOK("http://172.28.10.17:105/Claim/ClaimView/" + claim.Id, user.Email, claim.No);
                                Outlook.SendMail(receiver.Email, Constants.SUBJECT, content, receiver.MailCC);
                                //Outlook.SendMail("hoanht@umcvn.com", Constants.SUBJECT, content);

                            }

                        }
                    }
                }
                catch (Exception)
                {
                }

            }

        }
    }
}
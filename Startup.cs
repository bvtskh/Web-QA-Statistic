using FormProject.Controllers.Helper;
using Microsoft.Owin;
using Owin;
using System;
using System.IO;

[assembly: OwinStartupAttribute(typeof(FormProject.Startup))]
namespace FormProject
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }

        public void ConfigureAuth(IAppBuilder app)
        {
            changeNameFileVersion();
            app.MapSignalR();
            JobScheduler.Start();
        }
        private Tuple<string,string> getOldVersion(string file)
        {
            var fileName = Path.GetFileNameWithoutExtension(file);
            var start = fileName.IndexOf('[');
            var end = fileName.IndexOf(']');
            string versionOld = "0";
            if (start > 0 && end > 0)
            {
                versionOld = fileName.Substring(start + 1, end - start);
                fileName = fileName.Substring(0, start);
            }
            return Tuple.Create(versionOld,fileName);
        }
        private void changeNameFileVersion()
        {
            try
            {
                var path = Bet.Util.Config.GetValue("folder") + @"Content\css\";
                string[] files = Directory.GetFiles(path,"*.css");
                foreach (var file in files)
                {
                    var version = Bet.Util.Config.GetValue("version");
                    var getVer = getOldVersion(file);
                    var versionOld = getVer.Item1;
                    
                    if (version != versionOld)
                    {
                        if(version == "0")
                        {
                            File.Move(file, path + getVer.Item2 + ".css");
                        }
                        else
                        {
                            File.Move(file, path + getVer.Item2 + "[" + version + "].css");
                        }
                      
                    }

                }
                var pathJS = Bet.Util.Config.GetValue("folder") + @"Scripts\custom\";
                string[] filesJs = Directory.GetFiles(pathJS, "*.js");
                foreach (var file in filesJs)
                {
                    var version = Bet.Util.Config.GetValue("version");
                    var getVer = getOldVersion(file);
                    var versionOld = getVer.Item1;

                    if (version != versionOld)
                    {
                        if(version == "0")
                        {
                            File.Move(file, pathJS + getVer.Item2 +".js");
                        }
                        else
                        {
                            File.Move(file, pathJS + getVer.Item2 + "[" + version + "].js");
                        }
                       
                    }

                }
            }
            catch (Exception e)
            {

                Console.Write(e.Message.ToString());
            }

        }
    }
}

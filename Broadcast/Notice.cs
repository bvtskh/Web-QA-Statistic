using FormProject.Database;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormProject.Broadcast
{
    [HubName("notice")]
    public class NoticeBroadcast : Hub
    {
        public void Connect(string name)
        {
            Clients.Caller.connect(name);
        }
        public void Message(string name, string message)
        {
            Clients.All.message(name, message);
        }
    }
}
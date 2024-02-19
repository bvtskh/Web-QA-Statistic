using FormProject.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormProject.Controllers.Database
{
    public class ProcessDbManager : DbManager
    {
        public List<Process> GetAllProcess()
        {
            try
            {
                List<Process> process = db.Processes.ToList();
                return process != null ? process : new List<Process>();
            }
            catch (Exception)
            {
                return new List<Process>();
            }

        }
        public List<ProcessList> GetAllProcessList()
        {
            try
            {
                List<ProcessList> process = db.ProcessLists.ToList();
                return process != null ? process : new List<ProcessList>();
            }
            catch (Exception)
            {
                return new List<ProcessList>();
            }

        }
        public List<Process> OrderByDescending()
        {
            try
            {
                List<Process> process = db.Processes.OrderByDescending(m => m.Id).ToList();
                return process != null ? process : new List<Process>();
            }
            catch (Exception)
            {
                return new List<Process>();
            }

        }
        public Process GetProcessByName(string name)
        {
            try
            {
                return db.Processes.Where(m => m.Name == name).FirstOrDefault();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public int Add(Process process)
        {
            try
            {
                db.Processes.Add(process);
                db.SaveChanges();
                return Constants.STATUS_SUCCESS;
            }
            catch (Exception)
            {
                return Constants.STATUS_ERROR;
            }
        }
        public int Add(ProcessList pList)
        {
            try
            {
                db.ProcessLists.Add(pList);
                db.SaveChanges();
                return Constants.STATUS_SUCCESS;
            }
            catch (Exception)
            {
                return Constants.STATUS_ERROR;
            }
        }
        public int Delete(int Id)
        {
            try
            {
                Process process = db.Processes.Where(m => m.Id == Id).FirstOrDefault();
                db.Processes.Remove(process);
                db.SaveChanges();
                return Constants.STATUS_SUCCESS;
            }
            catch (Exception)
            {
                return Constants.STATUS_ERROR;
            }
        }
       
    }
}
using FormProject.Database;
using FormProject.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FormProject.Controllers.Database
{
    public class UserDbManager : DbManager
    {
        public List<User> GetAllUser()
        {
            try
            {
                List<User> users = db.Users.ToList();
                return users != null ? users : new List<User>();
            }
            catch (Exception)
            {
                return new List<User>();
            }

        }
        public User GetUserById(string Id)
        {
            try
            {
                User user = db.Users.Where(m => m.Id == Id).FirstOrDefault();
                return user != null ? user : null;
            }
            catch (Exception)
            {
                return null;
            }

        }
        public List<UserSelectModel> ConvertUserToUserSelectModel(List<User> users)
        {
            try
            {
                if (users.Count == 0) return new List<UserSelectModel>();
                List<UserSelectModel> selectedUsers = users.Select((x, i) => new UserSelectModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Email = x.Email
                }).ToList();
                return selectedUsers != null ? selectedUsers : new List<UserSelectModel>();
            }
            catch (Exception)
            {
                return new List<UserSelectModel>();
            }
        }

        public async Task<User> GetUserWithPassword(string Id, string password)
        {
            try
            {
                return await db.Users.Where(m => m.Id == Id && m.Password == password).FirstOrDefaultAsync();
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public List<Department> GetDepartments()
        {
            try
            {
                List<Department> departments = db.Departments.ToList();
                return departments != null ? departments : new List<Department>();
            }
            catch (Exception)
            {
                return new List<Department>();
            }

        }
        public List<Position> GetPositions()
        {
            try
            {
                List<Position> positions = db.Positions.ToList();
                return positions != null ? positions : new List<Position>();
            }
            catch (Exception)
            {
                return new List<Position>();
            }

        }

        public int Add(User user)
        {
            try
            {
                db.Users.Add(user);
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
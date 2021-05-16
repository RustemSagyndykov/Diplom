using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models
{
    public class ApplicationUserModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        //public string FullName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Patronymic { get; set; }
        public string PhoneNumber { get; set; }
        public string ImgPath { get; set; }
        public bool? IsBlocked { get; set; }
        public string Role { get; set; }
        public DateTime? DateBirthday { get; set; }
    }
}

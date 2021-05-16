using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestDiplom.Models
{
    public class ApplicationUser:IdentityUser
    {
        //[Column(TypeName="nvarchar(150)")]
        //public string FullName { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string FirstName { get; set; }
        [Column(TypeName = "nvarchar(150)")]
        public string LastName { get; set; }
        [Column(TypeName = "nvarchar(150)")]
        public string Patronymic { get; set; }
        public string ImgPath { get; set; }
        public bool? IsBlocked { get; set; }
        public DateTime? DateBirthday { get; set; }
    }
}

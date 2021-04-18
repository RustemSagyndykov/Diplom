using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TestDiplom.Models.Lecture;

namespace TestDiplom.Models
{
    public class AuthenticationContext: IdentityDbContext
    {
        public AuthenticationContext(DbContextOptions options) : base(options)
        { 
            
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Lecture.Lecture> Lectures { get; set; }
        public DbSet<LectureFile> LectureFiles { get; set; }
    }
}

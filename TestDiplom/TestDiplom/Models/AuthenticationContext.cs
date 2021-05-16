using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TestDiplom.Models.Lecture;
using TestDiplom.Models.test;
using TestDiplom.Models.Subject;
using TestDiplom.Models.Practice;
using TestDiplom.Models.StudentPractice;
using TestDiplom.Models.Comment;

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
        public DbSet<Test> Tests { get; set; }
        public DbSet<TestQuestion> TestQuestions { get; set; }
        public DbSet<TestQuestionAnswer> TestQuestionAnswers { get; set; }
        public DbSet<Subject.Subject> Subjects { get; set; }
        public DbSet<Practice.Practice> Practices { get; set; }
        public DbSet<PracticeFiles> PracticeFiles { get; set; }
        public DbSet<StudentSubject.StudentSubject> StudentSubjects { get; set; }
        public DbSet<StudentTesting.StudentTesting> StudentTestings { get; set; }
        public DbSet<StudentPractice.StudentPractice> StudentPractices { get; set; }
        public DbSet<StudentPracticeFile> StudentPracticeFiles { get; set; }
        public DbSet<Comment.Comment> Comments { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Lecture.Lecture>()
                .HasOne(l=>l.TestFk)
                .WithMany()
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Lecture.Lecture>()
                .HasOne(l => l.SubjectFk)
                .WithMany()
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Lecture.Lecture>()
                .HasOne(l => l.PracticeFk)
                .WithMany()
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Practice.Practice>()
                .HasOne(l => l.SubjectFk)
                .WithMany()
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Test>()
                .HasOne(l => l.SubjectFk)
                .WithMany()
                .OnDelete(DeleteBehavior.SetNull);

            base.OnModelCreating(modelBuilder);

        }
    }
}

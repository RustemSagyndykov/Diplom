using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.StudentPractice
{
    public class StudentPracticeModel
    {
        public int Id { get; set; }
        public int PracticeId { get; set; }
        public string PracticeName { get; set; }
        public string StudentId { get; set; }
        public string StudentFullName { get; set; }
        public string SubjectName { get; set; }
        public double PracticeScore { get; set; }
        public bool IsAccept { get; set; }
        public bool IsRevision { get; set; }
        public IList<StudentPracticeFile> StudentPracticeFiles { get; set; }
    }
}

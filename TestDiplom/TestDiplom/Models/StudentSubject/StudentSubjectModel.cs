using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.StudentSubject
{
    public class StudentSubjectModel
    {
        public int Id { get; set; }
        public bool IsSubscribe { get; set; }
        public string StudentId { get; set; }
        public int SubjectId { get; set; }
        public string SubjectName { get; set; }
        public double SubjectScore { get; set; }
        public string AcademicStatus { get; set; }

    }
}

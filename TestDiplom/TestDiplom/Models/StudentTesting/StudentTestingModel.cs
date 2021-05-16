using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.StudentTesting
{
    public class StudentTestingModel
    {
        public int Id { get; set; }
        public string StudentId { get; set; }
        public int TestId { get; set; }
        public double TestScore { get; set; }
        public bool IsTested { get; set; }
    }
}

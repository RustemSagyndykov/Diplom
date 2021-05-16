using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models.test;

namespace TestDiplom.Models.StudentTesting
{
    public class StudentTesting
    {
        public int Id { get; set; }
        public string StudentId { get; set; }

        [ForeignKey("StudentId")]
        public ApplicationUser StudentFk { get; set; }
        public int TestId { get; set; }
        [ForeignKey("TestId")]
        public Test TestFk { get; set; }
        public double TestScore { get; set; }
        public bool IsTested { get; set; }
    }
}

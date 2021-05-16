using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.StudentPractice
{
    public class StudentPracticeFile
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string Path { get; set; }
        public int StudentPracticeId { get; set; }
        [ForeignKey("StudentPracticeId")]
        public StudentPractice StudentPracticeFk { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.StudentPractice
{
    public class StudentPractice
    {
        public int Id { get; set; }
        public int PracticeId { get; set; }
        [ForeignKey("PracticeId")]
        public Practice.Practice PracticeFk { get; set; }
        public string StudentId { get; set; }

        [ForeignKey("StudentId")]
        public ApplicationUser StudentFk { get; set; }

        public double PracticeScore { get; set; }

        public bool IsAccept { get; set; }
        public bool IsRevision { get; set; }
    }
}

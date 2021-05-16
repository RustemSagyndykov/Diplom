using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.StudentSubject
{
    public class StudentSubject
    {
        public int Id { get; set; }
        public bool IsSubscribe { get; set; }
        public string StudentId { get; set; }
        [ForeignKey("StudentId")]
        public ApplicationUser SrudentFk { get; set; }
        public int SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject.Subject SubjectFk { get; set; }

    }
}

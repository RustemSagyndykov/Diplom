using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models.test;
using TestDiplom.Models.Subject;
using TestDiplom.Models.Practice;

namespace TestDiplom.Models.Lecture
{
    public class Lecture
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }

        public string OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public ApplicationUser OwnerFk { get; set; }
        public int? TestId { get; set; }
        [ForeignKey("TestId")]
        public Test TestFk { get; set; }
        public int? SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject.Subject SubjectFk { get; set; }
        public int? PracticeId { get; set; }
        [ForeignKey("PracticeId")]
        public Practice.Practice PracticeFk { get; set; }

    }
}

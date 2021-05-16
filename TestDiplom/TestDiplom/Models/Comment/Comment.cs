using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models;

namespace TestDiplom.Models.Comment
{
    public class Comment
    {
        public int Id { get; set; }
        public int StudentPracticeId { get; set; }
        [ForeignKey("StudentPracticeId")]
        public StudentPractice.StudentPractice StudentPracticeFk { get; set; }
        public string OwnerId { get; set; }
        [ForeignKey("OwnerId")]
        public ApplicationUser OwnerFk { get; set; }
        public string CommentContent { get; set; }
        public DateTime CreationTime { get; set; }
    }
}

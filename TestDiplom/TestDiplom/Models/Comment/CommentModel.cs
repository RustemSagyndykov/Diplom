using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.Comment
{
    public class CommentModel
    {
        public int Id { get; set; }
        public int StudentPracticeId { get; set; }
        public string OwnerId { get; set; }
        public string OwnerName { get; set; }
        public string CommentContent { get; set; }
        public DateTime CreationTime { get; set; }
    }
}

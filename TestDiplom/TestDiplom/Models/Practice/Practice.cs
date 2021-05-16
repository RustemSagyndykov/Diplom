using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.Practice
{
    public class Practice
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public ApplicationUser OwnerFk { get; set; }
        public int? SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject.Subject SubjectFk { get; set; }
    }
}

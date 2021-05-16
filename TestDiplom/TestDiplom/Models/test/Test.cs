using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestDiplom.Models.test
{
    public class Test
    {
        public int Id { get; set; }
        public int IdForView { get; set; }
        public string Name { get; set; }
        public string OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public ApplicationUser OwnerFk { get; set; }
        public int? SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject.Subject SubjectFk { get; set; }
    }
}

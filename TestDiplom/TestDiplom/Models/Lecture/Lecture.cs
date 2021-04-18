using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

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
    }
}

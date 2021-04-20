using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.test
{
    public class TestQuestion
    {
        public int Id { get; set; }
        public int IdForView { get; set; }
        public string Name { get; set; }
        public int TestId { get; set; }

        [ForeignKey("TestId")]
        public Test TestFk { get; set; }
    }
}

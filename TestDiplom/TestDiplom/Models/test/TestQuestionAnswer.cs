using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.test
{
    public class TestQuestionAnswer
    {
        public int Id { get; set; }
        public int IdForView { get; set; }
        public string Name { get; set; }
        public bool? IsCorrect { get; set; }
        public int TestQuestionId { get; set; }

        [ForeignKey("TestQuestionId")]
        public TestQuestion TestQuestionFk { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.test
{
    public class TestQuestionAnswerModel
    {
        public int Id { get; set; }
        public int IdForView { get; set; }
        public string Name { get; set; }
        public bool? IsCorrect { get; set; }
        public int TestQuestionId { get; set; }
    }
}

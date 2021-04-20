using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models;

namespace TestDiplom.Models.test
{
    public class TestQuestionModel
    {
        public int Id { get; set; }
        public int IdForView { get; set; }
        public string Name { get; set; }
        public int TestId { get; set; }
        public IList<TestQuestionAnswerModel> TestQuestionAnswer { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models;

namespace TestDiplom.Models.test
{
    public class TestModel
    {
        public int Id { get; set; }
        public int IdForView { get; set; }
        public string Name { get; set; }
        public string OwnerId { get; set; }
        public int? SubjectId { get; set; }
        public string SubjectName { get; set; }
        public int AmountTestQuestions { get; set; }
        public IList<TestQuestionModel> TestQuestions { get; set; }
    }
}

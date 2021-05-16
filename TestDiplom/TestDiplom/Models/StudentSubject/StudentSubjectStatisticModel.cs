using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models.Practice;
using TestDiplom.Models.test;

namespace TestDiplom.Models.StudentSubject
{
    public class StudentSubjectStatisticModel
    {
        public List<PracticeModel> PracticeList { get; set; }
        public List<TestModel> TestList { get; set; }
    }
}

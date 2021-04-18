using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.Lecture
{
    public class LectureModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }

        public string OwnerId { get; set; }

        public IList<LectureFile> LectureFiles { get; set; }

    }
}

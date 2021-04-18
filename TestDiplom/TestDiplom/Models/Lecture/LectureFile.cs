using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models.Lecture;

namespace TestDiplom.Models.Lecture
{
    public class LectureFile
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string Path { get; set; }
        public int LectureId { get; set; }
        [ForeignKey("LectureId")]
        public Lecture LectureFk { get; set; }
    }
}

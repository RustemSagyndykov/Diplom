using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.Practice
{
    public class PracticeFiles
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string Path { get; set; }
        public int PracticeId { get; set; }
        [ForeignKey("PracticeId")]
        public Practice PracticeFk { get; set; }
    }
}

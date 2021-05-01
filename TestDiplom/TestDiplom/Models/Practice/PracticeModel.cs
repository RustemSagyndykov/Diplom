﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.Practice
{
    public class PracticeModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string OwnerId { get; set; }
        public IList<PracticeFiles> PracticeFiles { get; set; }
    }
}

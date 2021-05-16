using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models;
using TestDiplom.Models.StudentTesting;

namespace TestDiplom.Controllers.StudentTesting
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentTestingController : ControllerBase
    {
        private readonly AuthenticationContext _context;
        public StudentTestingController(AuthenticationContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize]
        [Route("CreateOrEdit")]
        //POST : /api/StudentTesting/CreateOrEdit

        public async Task CreateOrEdit(StudentTestingModel model)
        {
            if (model.Id == 0)
            {
                await Create(model);
            }
            else
            {
                await Update(model);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("Create")]
        //POST : /api/StudentTesting/Create

        public async Task<Object> Create(StudentTestingModel model)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var testing = new Models.StudentTesting.StudentTesting()
            {
                StudentId = userId,
                TestId = model.TestId,
                IsTested = true,
                TestScore = model.TestScore
            };
            try
            {
                var result = await _context.StudentTestings.AddAsync(testing);
                await _context.SaveChangesAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [Authorize]
        [Route("Update")]
        //POST : /api/StudentTesting/Update

        public async Task Update(StudentTestingModel model)
        {

            var updateTesting = await _context.StudentTestings.FirstOrDefaultAsync(t => t.Id == model.Id);

            updateTesting.StudentId = model.StudentId;
            updateTesting.TestId = model.TestId;
            updateTesting.TestScore = model.TestScore;

            _context.StudentTestings.Update(updateTesting);
            await _context.SaveChangesAsync();
        }

        [HttpGet]
        [Authorize]
        [Route("GetAllForStudent")]
        //GET : /api/StudentTesting/GetAllForStudent
        public async Task<List<StudentTestingModel>> GetAllForStudent()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var sub = await _context.StudentTestings
                .Where(s => s.StudentId == userId).ToListAsync();

            var studentTesting = new List<StudentTestingModel>();

            foreach (var item in sub)
            {
                var s = new StudentTestingModel
                {
                    Id = item.Id,
                    TestId = item.TestId,
                    StudentId = item.StudentId,
                    TestScore = item.TestScore,
                    IsTested = item.IsTested

                };

                studentTesting.Add(s);
            }

            return studentTesting;
        }
    }
}

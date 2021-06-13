using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models;
using TestDiplom.Models.Subject;

namespace TestDiplom.Controllers.subject
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private AuthenticationContext _context;
        public SubjectController(AuthenticationContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize]
        [Route("CreateOrEdit")]
        //POST : /api/Subject/CreateOrEdit

        public async Task CreateOrEdit(Subject model)
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
        //POST : /api/Subject/Create
        public async Task<Object> Create(Subject model)
        {

            var subject = new Subject()
            {
                Name = model.Name,
                CreationTime = DateTime.Now
            };
            try
            {
                await _context.Subjects.AddAsync(subject);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        [Authorize]
        [Route("GetAll")]
        //GET : /api/Subject/GetAll
        public async Task<List<Subject>> GetAll(string filterText)
        {
            var sub = await _context.Subjects
                .Where(l => (!string.IsNullOrWhiteSpace(filterText)) ? l.Name.Contains(filterText)
                || l.CreationTime.Date.ToString().Contains(filterText.Length == 10 ? Convert.ToDateTime(filterText).ToString("yyyy-MM-dd") : filterText)
                 : true).ToListAsync();

            var subjects = new List<Subject>();

            foreach (var item in sub)
            {
                var s = new Subject
                {
                    Id = item.Id,
                    Name = item.Name,
                    CreationTime = item.CreationTime

                };

                subjects.Add(s);
            }

            return subjects;
        }

        [HttpGet]
        [Authorize]
        [Route("GetById")]
        //GET : /api/Subject/GetById

        public async Task<Subject> GetById(int id)
        {
            var sub = await _context.Subjects.Where(s => s.Id == id).FirstOrDefaultAsync();

            var ret = new Subject
            {
                Id = sub.Id,
                Name = sub.Name,
                CreationTime = sub.CreationTime
            };
            return ret;
        }

        [HttpDelete]
        [Authorize]
        [Route("Delete")]
        //Delete : /api/Subject/Delete
        public async Task Delete(int id)
        {
            var deleteItem = await _context.Subjects.FirstOrDefaultAsync(t => t.Id == id);

            if (deleteItem != null)
            {
                _context.Subjects.Remove(deleteItem);
                await _context.SaveChangesAsync();
            }
        }

        [HttpPost]
        [Authorize]
        [Route("Update")]
        //POST : /api/Subject/Update

        public async Task Update(Subject model)
        {

            var update = await _context.Subjects.FirstOrDefaultAsync(s => s.Id == model.Id);

            update.Name = model.Name;
            update.CreationTime = DateTime.Now;

            _context.Subjects.Update(update);

            await _context.SaveChangesAsync();
        }
    }
}

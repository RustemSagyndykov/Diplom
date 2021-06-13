using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models;
using TestDiplom.Models.Practice;

namespace TestDiplom.Controllers.practice
{
    [Route("api/[controller]")]
    [ApiController]
    public class PracticeController : ControllerBase
    {
        private readonly AuthenticationContext _context;
        public PracticeController(AuthenticationContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize]
        [Route("CreateOrEdit")]
        //POST : /api/Practice/CreateOrEdit

        public async Task CreateOrEdit(PracticeModel model)
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

        [HttpGet]
        [Authorize]
        [Route("GetAll")]
        //GET : /api/Practice/GetAll
        public async Task<List<PracticeModel>> GetAll(string filterText)
        {
            var lst = await _context.Practices
                .Where(p => (!string.IsNullOrWhiteSpace(filterText)) ? p.Name.Contains(filterText) : true)
                .ToListAsync();

            var practices = new List<PracticeModel>();

            foreach (var item in lst)
            {
                var practice = new PracticeModel
                {
                    Id = item.Id,
                    Name = item.Name
                };

                practices.Add(practice);
            }

            return practices;
        }

        [HttpGet]
        [Authorize(Roles = "Teacher")]
        [Route("GetAllPracticeForTeacher")]
        //GET : /api/Practice/GetAllPracticeForTeacher
        public async Task<List<PracticeModel>> GetAllPracticeForTeacher(string filterText)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var list = await _context.Practices
                .Include(p => p.SubjectFk)
                .Include(p => p.OwnerFk)
                .Where(p => p.OwnerId == userId)
                .Where(p => (!string.IsNullOrWhiteSpace(filterText)) ? p.Name.Contains(filterText)
                || p.SubjectFk.Name.Contains(filterText)
                || (p.OwnerFk.LastName.Replace(" ", "") + p.OwnerFk.FirstName.Replace(" ", "") + p.OwnerFk.Patronymic.Replace(" ", "")).ToUpper().Contains(filterText.Replace(" ", "").ToUpper())
                || (p.OwnerFk.LastName.Replace(" ", "") + p.OwnerFk.Patronymic.Replace(" ", "")).ToUpper().Contains(filterText.Replace(" ", "").ToUpper())
                || (p.OwnerFk.FirstName.Replace(" ", "") + p.OwnerFk.LastName.Replace(" ", "")).ToUpper().Contains(filterText.Replace(" ", "").ToUpper())
                || (p.OwnerFk.Patronymic.Replace(" ", "") + p.OwnerFk.LastName.Replace(" ", "")).ToUpper().Contains(filterText.Replace(" ", "").ToUpper())
                || (p.OwnerFk.Patronymic.Replace(" ", "") + p.OwnerFk.FirstName.Replace(" ", "")).ToUpper().Contains(filterText.Replace(" ", "").ToUpper())
                : true)
                .ToListAsync();

            var lst = new List<PracticeModel>();

            foreach (var item in list)
            {
                var practice = new PracticeModel();

                practice.Id = item.Id;
                practice.Name = item.Name;
                practice.OwnerId = item.OwnerId;
                //practice.OwnerName = item.OwnerFk.FullName;
                practice.OwnerName = item.OwnerFk.LastName + " " + item.OwnerFk.FirstName + " " + item.OwnerFk.Patronymic;
                practice.SubjectName = item.SubjectFk.Name;
                practice.PracticeFiles = GetAllPracticeFilesById(item.Id);

                lst.Add(practice);
            }

            return lst;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("GetAllPracticeForAdmin")]
        //GET : /api/Practice/GetAllPracticeForAdmin
        public async Task<List<PracticeModel>> GetAllPracticeForAdmin(string filterText)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var list = await _context.Practices
                .Include(p => p.SubjectFk)
                .Include(p => p.OwnerFk)
                .Where(p => (!string.IsNullOrWhiteSpace(filterText)) ? p.Name.Contains(filterText)
                || p.SubjectFk.Name.Contains(filterText)
                || (p.OwnerFk.LastName.Replace(" ", "") + p.OwnerFk.FirstName.Replace(" ", "") + p.OwnerFk.Patronymic.Replace(" ", "")).ToUpper().Contains(filterText.Replace(" ", "").ToUpper())
                || (p.OwnerFk.LastName.Replace(" ", "") + p.OwnerFk.Patronymic.Replace(" ", "")).ToUpper().Contains(filterText.Replace(" ", "").ToUpper())
                || (p.OwnerFk.FirstName.Replace(" ", "") + p.OwnerFk.LastName.Replace(" ", "")).ToUpper().Contains(filterText.Replace(" ", "").ToUpper())
                || (p.OwnerFk.Patronymic.Replace(" ", "") + p.OwnerFk.LastName.Replace(" ", "")).ToUpper().Contains(filterText.Replace(" ", "").ToUpper())
                || (p.OwnerFk.Patronymic.Replace(" ", "") + p.OwnerFk.FirstName.Replace(" ", "")).ToUpper().Contains(filterText.Replace(" ", "").ToUpper())
                : true)
                .ToListAsync();

            var lst = new List<PracticeModel>();

            foreach (var item in list)
            {
                var practice = new PracticeModel();

                practice.Id = item.Id;
                practice.Name = item.Name;
                practice.OwnerId = item.OwnerId;
                practice.OwnerName = item.OwnerFk.LastName + " " + item.OwnerFk.FirstName + " " + item.OwnerFk.Patronymic;
                practice.SubjectName = item.SubjectFk.Name;
                practice.PracticeFiles = GetAllPracticeFilesById(item.Id);

                lst.Add(practice);
            }

            return lst;
        }

        [HttpGet]
        [Authorize]
        [Route("GetAllForStudent")]
        //GET : /api/Practice/GetAllForStudent
        public async Task<List<PracticeModel>> GetAllForStudent(string filterText)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var subjects = await _context.StudentSubjects.Where(s => s.StudentId == userId && s.IsSubscribe == true).ToListAsync();

            var lst = new List<PracticeModel>();

            foreach (var item in subjects)
            {
                var list = await _context.Practices
                    .Include(p => p.SubjectFk)
                    .Where(p => p.SubjectId == item.SubjectId)
                    .Where(p => (!string.IsNullOrWhiteSpace(filterText)) ? p.Name.Contains(filterText)
                    || p.SubjectFk.Name.Contains(filterText)
                    : true)
                    .ToListAsync();

                foreach (var p in list) 
                {
                    var practice = new PracticeModel();

                    practice.Id = p.Id;
                    practice.Name = p.Name;
                    practice.OwnerId = p.OwnerId;
                    practice.SubjectName = p.SubjectFk.Name;
                    practice.PracticeFiles = GetAllPracticeFilesById(p.Id);

                    lst.Add(practice);
                }

            }

            return lst;
        }

        [HttpGet]
        [Authorize]
        [Route("GetPracticeById")]
        //GET : /api/Practice/GetPracticeById
        public async Task<PracticeModel> GetPracticeById(string Id)
        {
            var id = Convert.ToInt32(Id);
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            //var prac = await _context.Practices.Where(p => p.Id == id).FirstOrDefaultAsync();
            var prac = await _context.Practices.Include(p => p.SubjectFk).Where(p => p.Id == id).FirstOrDefaultAsync();

            var practice = new PracticeModel();

            practice.Id = prac.Id;
            practice.Name = prac.Name;
            practice.OwnerId = prac.OwnerId;
            practice.SubjectId = prac.SubjectId;
            practice.SubjectName = prac.SubjectFk == null ? "" : prac.SubjectFk.Name;
            practice.PracticeFiles = GetAllPracticeFilesById(prac.Id);

            return practice;
        }

        [HttpGet]
        [Authorize]
        [Route("GetAllPracticeFilesById")]
        //GET : /api/Practice/GetAllPracticeFilesById
        public List<PracticeFiles> GetAllPracticeFilesById(int id)
        {
            var files = _context.PracticeFiles.Where(f => f.PracticeId == id);

            var filesArr = new List<PracticeFiles>();

            foreach (var item in files)
            {
                var f = new PracticeFiles();
                f.Path = item.Path;
                f.FileName = item.FileName;
                filesArr.Add(f);
            }

            return filesArr;

        }

        [HttpPost]
        [Authorize]
        [Route("Create")]
        //POST : /api/Practice/Create
        public async Task<Object> Create(PracticeModel model)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var practice = new Practice()
            {
                Name = model.Name,
                OwnerId = userId,
                SubjectId = model.SubjectId
            };
            try
            {
                await _context.Practices.AddAsync(practice);
                await _context.SaveChangesAsync();

                var Id = practice.Id;

                await InsertFiles(model.PracticeFiles, Id);

                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        protected async Task InsertFiles(IList<PracticeFiles> files, int id)
        {
            for (int i = 0; i < files.Count; i++)
            {
                var file = new PracticeFiles
                {
                    FileName = files[i].FileName,
                    Path = files[i].Path,
                    PracticeId = id,
                };

                await _context.PracticeFiles.AddAsync(file);
                await _context.SaveChangesAsync();
            }
        }

        [HttpPost]
        [Authorize]
        [Route("UpdatePractice")]
        //POST : /api/Practice/UpdatePractice

        public async Task Update(PracticeModel model)
        {

            var updatePractice = await _context.Practices.FirstOrDefaultAsync(p => p.Id == model.Id);

            updatePractice.Name = model.Name;
            updatePractice.SubjectId = model.SubjectId;

            await DeletePracticeFiles(model.Id);

            await InsertFiles(model.PracticeFiles, model.Id);

            await _context.SaveChangesAsync();
        }

        protected async Task<List<PracticeFiles>> DeletePracticeFiles(int id)
        {
            var deleteItem = await _context.PracticeFiles.Where(p => p.PracticeId == id).ToListAsync();
            if (deleteItem != null)
            {
                _context.PracticeFiles.RemoveRange(deleteItem);
                _context.SaveChanges();
            }
            return deleteItem;
        }

        [HttpDelete]
        [Authorize]
        [Route("Delete")]
        //GET : /api/Practice/Delete
        public Practice Delete(int id)
        {
            var deleteItem = _context.Practices.FirstOrDefault(p => p.Id == id);
            if (deleteItem != null)
            {
                _context.Practices.Remove(deleteItem);
                _context.SaveChanges();
            }
            return deleteItem;
        }
    }
}

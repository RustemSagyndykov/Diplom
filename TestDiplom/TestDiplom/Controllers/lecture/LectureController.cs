using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models;
using TestDiplom.Models.Lecture;

namespace TestDiplom.Controllers.lecture
{
    [Route("api/[controller]")]
    [ApiController]
    public class LectureController : ControllerBase
    {
        private AuthenticationContext _context;
        public LectureController(AuthenticationContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize]
        [Route("CreateOrEdit")]
        //POST : /api/Lecture/CreateOrEdit

        public async Task CreateOrEdit(LectureModel model)
        {
            if (model.Id == 0)
            {
                await CreateLecture(model);
            }
            else
            {
                await UpdateLecture(model);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("UpdateLecture")]
        //POST : /api/Test/UpdateLecture

        public async Task UpdateLecture(LectureModel model)
        {

            var updateLecture = await _context.Lectures.FirstOrDefaultAsync(l => l.Id == model.Id);

            updateLecture.Name = model.Name;
            updateLecture.Content = model.Content;
            updateLecture.TestId = model.TestId;
            updateLecture.SubjectId = model.SubjectId;
            updateLecture.PracticeId = model.PracticeId;

            await DeleteLecFiles(model.Id);

            await InsertFiles(model.LectureFiles,model.Id);

            await _context.SaveChangesAsync();
        }

        [HttpGet]
        [Authorize]
        [Route("GetAllLecturesForUser")]
        //GET : /api/Lecture/GetAllLecturesForUser
        public List<LectureModel> GetAllLecturesForUser()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var list = _context.Lectures
                .Include(l => l.OwnerFk)
                .Include(l => l.SubjectFk).Where(l => l.OwnerId == userId);

            var lst = new List<LectureModel>();

            foreach (var item in list)
            {
                var lecture = new LectureModel();

                lecture.Id = item.Id;
                lecture.Name = item.Name;
                lecture.OwnerId = item.OwnerId;
                lecture.SubjectName = item.SubjectFk.Name;
                lecture.OwnerName = item.OwnerFk.FirstName + " " + item.OwnerFk.LastName + " " + item.OwnerFk.Patronymic;
                lecture.LectureFiles = GetAllLectureFilesById(item.Id);

                lst.Add(lecture);
            }

            return lst;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("GetAllLecturesForAdmin")]
        //GET : /api/Lecture/GetAllLecturesForAdmin
        public async  Task<List<LectureModel>> GetAllLecturesForAdmin()
        {
            var list = await _context.Lectures
                .Include(l => l.OwnerFk)
                .Include(l => l.SubjectFk).ToListAsync();

            var lst = new List<LectureModel>();

            foreach (var item in list)
            {
                var lecture = new LectureModel();

                lecture.Id = item.Id;
                lecture.Name = item.Name;
                lecture.OwnerId = item.OwnerId;
                lecture.SubjectName = item.SubjectFk.Name;
                //lecture.OwnerName = item.OwnerFk.FullName;
                lecture.OwnerName = item.OwnerFk.FirstName + " " + item.OwnerFk.LastName + " " + item.OwnerFk.Patronymic;
                lecture.LectureFiles = GetAllLectureFilesById(item.Id);

                lst.Add(lecture);
            }

            return lst;
        }

        [HttpGet]
        [Authorize(Roles = "Student")]
        [Route("GetAllLecturesForStudent")]
        //GET : /api/Lecture/GetAllLecturesForStudent
        public async Task<List<LectureModel>> GetAllLecturesForStudent()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var subjects = await _context.StudentSubjects.Where(s => s.StudentId == userId && s.IsSubscribe == true).ToListAsync();

            var lst = new List<LectureModel>();

            foreach (var s in subjects)
            {
                var list = await _context.Lectures.Include(l => l.SubjectFk).Where(l => l.SubjectId == s.SubjectId).ToListAsync();

                foreach (var item in list)
                {
                    var lecture = new LectureModel();

                    lecture.Id = item.Id;
                    lecture.Name = item.Name;
                    lecture.OwnerId = item.OwnerId;
                    lecture.SubjectName = item.SubjectFk.Name;
                    lecture.PracticeId = item.PracticeId;
                    lecture.TestId = item.TestId;
                    lecture.LectureFiles = GetAllLectureFilesById(item.Id);

                    lst.Add(lecture);
                }
            }

            return lst;
        }

        [HttpGet]
        [Authorize]
        [Route("GetAllLecturesById")]
        //GET : /api/Lecture/GetAllLecturesById
        public LectureModel GetAllLecturesById(string Id)
        {
            var id = Convert.ToInt32(Id);
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            //var lec = _context.Lectures.Where(l => l.Id == id).FirstOrDefault();

            var lec = _context.Lectures
                .Include(l => l.TestFk)
                .Include(l => l.SubjectFk)
                .Include(l => l.PracticeFk)
                .Where(l => l.Id == id).FirstOrDefault();

            var lecture = new LectureModel();

            lecture.Id = lec.Id;
            lecture.Name = lec.Name;
            lecture.Content = lec.Content;
            lecture.OwnerId = lec.OwnerId;
            lecture.TestId = lec.TestId;
            lecture.TestName =lec.TestFk == null ? "" : lec.TestFk.Name;
            lecture.PracticeId = lec.PracticeId;
            lecture.PracticeName = lec.PracticeFk == null ? "" : lec.PracticeFk.Name;
            lecture.SubjectId = lec.SubjectId;
            lecture.SubjectName = lec.SubjectFk == null ? "" : lec.SubjectFk.Name;
            lecture.LectureFiles = GetAllLectureFilesById(lec.Id);

            return lecture;
        }

        [HttpGet]
        [Authorize]
        [Route("GetAllLectureFilesById")]
        //GET : /api/Lecture/GetAllLectureFilesById
        public List<LectureFile> GetAllLectureFilesById(int id)
        {
            var files = _context.LectureFiles.Where(f => f.LectureId == id);

            var filesArr = new List<LectureFile>();

            foreach (var item in files)
            {
                var f = new LectureFile();
                f.Path = item.Path;
                f.FileName = item.FileName;
                filesArr.Add(f);
            }

            return filesArr;

        }

        [HttpDelete]
        [Authorize]
        [Route("Delete")]
        //GET : /api/Lecture/Delete
        public Lecture Delete(int id)
        {
            var deleteItem = _context.Lectures.FirstOrDefault(l => l.Id == id);
            if (deleteItem != null)
            {
                _context.Lectures.Remove(deleteItem);
                _context.SaveChanges();
            }
            return deleteItem;
        }

        protected async Task<List<LectureFile>> DeleteLecFiles(int id)
        {
            var deleteItem = await _context.LectureFiles.Where(l => l.LectureId == id).ToListAsync();
            if (deleteItem != null)
            {
                _context.LectureFiles.RemoveRange(deleteItem);
                _context.SaveChanges();
            }
            return deleteItem;
        }

        [HttpPost]
        [Authorize]
        [Route("CreateLecture")]
        //POST : /api/Lecture/CreateLecture
        public async Task<Object> CreateLecture(LectureModel model)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var lecture = new Lecture()
            {
                Name = model.Name,
                Content = model.Content,
                OwnerId = userId,
                TestId = model.TestId,
                PracticeId = model.PracticeId,
                SubjectId = model.SubjectId
            };
            try
            {
                await _context.Lectures.AddAsync(lecture);
                await _context.SaveChangesAsync();

                var Id = lecture.Id;

                await InsertFiles(model.LectureFiles,Id);

                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        protected async Task InsertFiles(IList<LectureFile> files, int id)
        {
            for (int i = 0; i < files.Count; i++)
            {
                var file = new LectureFile
                {
                    FileName = files[i].FileName,
                    Path = files[i].Path,
                    LectureId = id,
                };

                await _context.LectureFiles.AddAsync(file);
                await _context.SaveChangesAsync();
            }
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        [Authorize]
        [Route("GetAllLecturesForUser")]
        //GET : /api/Lecture/GetAllLecturesForUser
        public List<LectureModel> GetAllLecturesForUser()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var list = _context.Lectures.Where(l => l.OwnerId == userId);

            var lst = new List<LectureModel>();

            foreach (var item in list)
            {
                var lecture = new LectureModel();

                lecture.Id = item.Id;
                lecture.Name = item.Name;
                lecture.OwnerId = item.OwnerId;
                lecture.LectureFiles = GetAllLectureFilesById(item.Id);

                lst.Add(lecture);
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

            var lec = _context.Lectures.Where(l => l.Id == id).FirstOrDefault();

            var lecture = new LectureModel
            {
                Id = lec.Id,
                Name = lec.Name,
                Content = lec.Content,
                OwnerId = lec.OwnerId,
                LectureFiles = GetAllLectureFilesById(lec.Id)
            };

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

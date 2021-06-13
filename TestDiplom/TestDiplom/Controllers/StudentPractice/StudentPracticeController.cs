using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models;
using TestDiplom.Models.SendMessage;
using TestDiplom.Models.StudentPractice;

namespace TestDiplom.Controllers.StudentPractice
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentPracticeController : ControllerBase
    {
        private readonly AuthenticationContext _context;
        private UserManager<ApplicationUser> _userManager;
        private ISendMessage _sendMessage;
        public StudentPracticeController(AuthenticationContext context, UserManager<ApplicationUser> userManager, ISendMessage sendMessage) 
        {
            _context = context;
            _userManager = userManager;
            _sendMessage = sendMessage;
        }

        [HttpPost]
        [Authorize]
        [Route("CreateOrEdit")]
        //POST : /api/StudentPractice/CreateOrEdit

        public async Task CreateOrEdit(StudentPracticeModel model)
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
        //POST : /api/StudentPractice/Create
        public async Task<Object> Create(StudentPracticeModel model)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var studentPractice = new Models.StudentPractice.StudentPractice()
            {
                PracticeId = model.PracticeId,
                StudentId = userId,
                PracticeScore = model.PracticeScore,
                IsAccept = model.IsAccept,
                IsRevision = model.IsRevision
            };
            try
            {
                await _context.StudentPractices.AddAsync(studentPractice);
                await _context.SaveChangesAsync();

                var Id = studentPractice.Id;

                await InsertFiles(model.StudentPracticeFiles, Id);

                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        protected async Task InsertFiles(IList<StudentPracticeFile> files, int id)
        {
            for (int i = 0; i < files.Count; i++)
            {
                var file = new StudentPracticeFile
                {
                    FileName = files[i].FileName,
                    Path = files[i].Path,
                    StudentPracticeId = id,
                };

                await _context.StudentPracticeFiles.AddAsync(file);
                await _context.SaveChangesAsync();
            }
        }

        [HttpPost]
        [Authorize]
        [Route("Update")]
        //POST : /api/StudentPractice/Update
        public async Task Update(StudentPracticeModel model)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            var user = await _userManager.FindByIdAsync(userId);
            var role = await _userManager.GetRolesAsync(user);

            var updateStudentPractice = await _context.StudentPractices
                .Include(s => s.StudentFk).FirstOrDefaultAsync(s => s.Id == model.Id);

            updateStudentPractice.PracticeId = model.PracticeId;
            updateStudentPractice.StudentId = model.StudentId;
            updateStudentPractice.PracticeScore = model.PracticeScore;
            updateStudentPractice.IsAccept = model.IsAccept;
            updateStudentPractice.IsRevision = model.IsRevision;

            await DeleteFiles(model.Id);

            await InsertFiles(model.StudentPracticeFiles, model.Id);

            await _context.SaveChangesAsync();

            if (role.FirstOrDefault() == "Teacher")
            {
                var status = "";
                if (model.IsAccept == true)
                {
                    status = "Принято";
                }
                else
                {
                    status = "Отправлено на доработку";
                }
                string message = $"Практическое заданиие {model.PracticeName} было проверено. Балл: {model.PracticeScore}. Статус: {status}";
                string firstName = updateStudentPractice.StudentFk.FirstName ?? "";
                string lastName = updateStudentPractice.StudentFk.LastName ?? "";
                string patronymic = updateStudentPractice.StudentFk.Patronymic ?? "";
                string fullName = firstName + " " + lastName + " " + patronymic;
                string letterHeader = "Практическое задание";

                _sendMessage.SendMessageToMail(updateStudentPractice.StudentFk.Email, message, fullName, letterHeader, false);
            }

        }


        protected async Task<List<StudentPracticeFile>> DeleteFiles(int id)
        {
            var deleteItem = await _context.StudentPracticeFiles.Where(p => p.StudentPracticeId == id).ToListAsync();
            if (deleteItem != null)
            {
                _context.StudentPracticeFiles.RemoveRange(deleteItem);
                _context.SaveChanges();
            }
            return deleteItem;
        }

        [HttpGet]
        [Authorize]
        [Route("GetAll")]
        //GET : /api/StudentPractice/GetAll
        public async Task<List<StudentPracticeModel>> GetAll(string filterText)
        {
            var lst = await _context.StudentPractices
                .Include(s => s.StudentFk)
                .Include(s => s.PracticeFk)
                .ThenInclude(p => p.SubjectFk)
                .Where(s => (!string.IsNullOrWhiteSpace(filterText)) ? s.PracticeFk.Name.Contains(filterText)
                || s.PracticeFk.SubjectFk.Name.Contains(filterText)
                || (s.StudentFk.LastName + " " + s.StudentFk.FirstName + " " + s.StudentFk.Patronymic).Contains(filterText)
                || s.PracticeScore.ToString() == filterText
                || (filterText.ToLower() == "принято" ? s.IsAccept == true : filterText.ToLower() == "отправлено на доработку" ? s.IsRevision == true : false)
                : true)
                .ToListAsync();

            var studentpractices = new List<StudentPracticeModel>();

            foreach (var p in lst)
            {
                var studentPractice = new StudentPracticeModel();
                string firstName = "", lastName = "", patronymic = "";

                studentPractice.Id = p.Id;
                studentPractice.StudentId = p.StudentId;
                studentPractice.PracticeId = p.PracticeId;
                studentPractice.IsAccept = p.IsAccept;
                studentPractice.IsRevision = p.IsRevision;
                firstName = p.StudentFk.FirstName ?? "";
                lastName = p.StudentFk.LastName ?? "";
                patronymic = p.StudentFk.Patronymic ?? "";
                studentPractice.StudentFullName = lastName + " " + firstName + " " + patronymic;
                //studentPractice.StudentFullName = p.StudentFk.FullName == null ? "" : p.StudentFk.FullName;
                studentPractice.PracticeName = p.PracticeFk.Name;
                studentPractice.SubjectName = p.PracticeFk.SubjectFk.Name;
                studentPractice.PracticeScore = p.PracticeScore;
                studentPractice.StudentPracticeFiles = GetAllFilesById(p.Id);

                studentpractices.Add(studentPractice);
            }

            return studentpractices;
        }

        [HttpGet]
        [Authorize]
        [Route("GetById")]
        //GET : /api/StudentPractice/GetById
        public async Task<StudentPracticeModel> GetById(string Id)
        {
            var id = Convert.ToInt32(Id);
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var p = await _context.StudentPractices
                .Include(s => s.StudentFk)
                .Include(s => s.PracticeFk)
                .ThenInclude(p => p.SubjectFk)
                .Where(s => s.PracticeId == id  && s.StudentId == userId).FirstOrDefaultAsync();

            var studentPractice = new StudentPracticeModel();
            studentPractice.StudentPracticeFiles = new List<StudentPracticeFile>();
            string firstName = "", lastName = "", patronymic = "";

            if (p != null)
            {
                studentPractice.Id = p.Id;
                studentPractice.StudentId = p.StudentId;
                studentPractice.PracticeId = p.PracticeId;
                studentPractice.IsAccept = p.IsAccept;
                studentPractice.IsRevision = p.IsRevision;
                firstName = p.StudentFk.FirstName ?? "";
                lastName = p.StudentFk.LastName ?? "";
                patronymic = p.StudentFk.Patronymic ?? "";
                studentPractice.StudentFullName = lastName + " " + firstName + " " + patronymic;
                //studentPractice.StudentFullName = p.StudentFk.FullName == null ? "" : p.StudentFk.FullName;
                studentPractice.PracticeName = p.PracticeFk.Name;
                studentPractice.SubjectName = p.PracticeFk.SubjectFk.Name;
                studentPractice.PracticeScore = p.PracticeScore;
                studentPractice.StudentPracticeFiles = GetAllFilesById(p.Id);
            }
            
            return studentPractice;
        }

        [HttpGet]
        [Authorize]
        [Route("GetAllFilesById")]
        //GET : /api/StudentPractice/GetAllFilesById
        public List<StudentPracticeFile> GetAllFilesById(int id)
        {
            var files = _context.StudentPracticeFiles.Where(f => f.StudentPracticeId == id);

            var filesArr = new List<StudentPracticeFile>();

            foreach (var item in files)
            {
                var f = new StudentPracticeFile();
                f.Path = item.Path;
                f.FileName = item.FileName;
                filesArr.Add(f);
            }

            return filesArr;

        }

        [HttpGet]
        [Authorize]
        [Route("GetByIdForTeacher")]
        //GET : /api/StudentPractice/GetByIdForTeacher
        public async Task<StudentPracticeModel> GetByIdForTeacher(string Id)
        {
            var id = Convert.ToInt32(Id);
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var p = await _context.StudentPractices
                .Include(s => s.StudentFk)
                .Include(s => s.PracticeFk)
                .ThenInclude(p => p.SubjectFk)
                .Where(s => s.Id == id).FirstOrDefaultAsync();

            var studentPractice = new StudentPracticeModel();
            studentPractice.StudentPracticeFiles = new List<StudentPracticeFile>();
            string firstName = "", lastName = "", patronymic = "";

            if (p != null)
            {
                studentPractice.Id = p.Id;
                studentPractice.StudentId = p.StudentId;
                studentPractice.PracticeId = p.PracticeId;
                studentPractice.IsAccept = p.IsAccept;
                studentPractice.IsRevision = p.IsRevision;
                studentPractice.PracticeName = p.PracticeFk.Name;
                studentPractice.SubjectName = p.PracticeFk.SubjectFk.Name;
                firstName = p.StudentFk.FirstName ?? "";
                lastName = p.StudentFk.LastName ?? "";
                patronymic = p.StudentFk.Patronymic ?? "";
                studentPractice.StudentFullName = lastName + " " + firstName + " " + patronymic;
                //studentPractice.StudentFullName = p.StudentFk.FullName == null ? "" : p.StudentFk.FullName;
                studentPractice.PracticeScore = p.PracticeScore;
                studentPractice.StudentPracticeFiles = GetAllFilesById(p.Id);
            }

            return studentPractice;
        }

        [HttpGet]
        [Authorize]
        [Route("GetAllForTeacher")]
        //GET : /api/StudentPractice/GetAllForTeacher
        public async Task<List<StudentPracticeModel>> GetAllForTeacher(string filterText)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var p = await _context.StudentPractices
                .Include(s => s.StudentFk)
                .Include(s => s.PracticeFk)
                .ThenInclude(p => p.SubjectFk)
                .Where(s => s.PracticeFk.OwnerId == userId)
                .Where(s => (!string.IsNullOrWhiteSpace(filterText)) ? s.PracticeFk.Name.Contains(filterText)
                || s.PracticeFk.SubjectFk.Name.Contains(filterText)
                || (s.StudentFk.LastName + " " + s.StudentFk.FirstName + " " + s.StudentFk.Patronymic).Contains(filterText)
                || (filterText.ToLower() == "принято" ? s.IsAccept == true : filterText.ToLower() == "отправлено на доработку" ? s.IsRevision == true : false)
                || s.PracticeScore.ToString() == filterText
                : true)
                .ToListAsync();

            var lst = new List<StudentPracticeModel>();

            foreach (var item in p)
            {
                var studentPractice = new StudentPracticeModel();
                studentPractice.StudentPracticeFiles = new List<StudentPracticeFile>();
                string firstName="", lastName="", patronymic = "";

                studentPractice.Id = item.Id;
                studentPractice.StudentId = item.StudentId;
                studentPractice.PracticeId = item.PracticeId;
                studentPractice.IsAccept = item.IsAccept;
                studentPractice.IsRevision = item.IsRevision;
                studentPractice.PracticeName = item.PracticeFk.Name;
                studentPractice.SubjectName = item.PracticeFk.SubjectFk.Name;
                firstName = item.StudentFk.FirstName ?? "";
                lastName = item.StudentFk.LastName ?? "";
                patronymic = item.StudentFk.Patronymic ?? "";
                studentPractice.StudentFullName = lastName + " " + firstName + " " + patronymic;
                studentPractice.PracticeScore = item.PracticeScore;
                studentPractice.StudentPracticeFiles = GetAllFilesById(item.Id);

                lst.Add(studentPractice);
            }

            return lst;
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models;
using TestDiplom.Models.test;

namespace TestDiplom.Controllers.test
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private AuthenticationContext _context;

        public TestController(AuthenticationContext context) 
        {
            _context = context;
        }

        [HttpPost]
        [Authorize]
        [Route("CreateOrEdit")]
        //POST : /api/Test/CreateOrEdit

        public async Task CreateOrEdit(TestModel model)
        {
            if (model.Id == 0)
            {
                await CreateTest(model);
            }
            else 
            {
                await UpdateTest(model);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("UpdateTest")]
        //POST : /api/Test/CreateTest

        public async Task UpdateTest(TestModel model)
        {
            var updateTest = await _context.Tests.FirstOrDefaultAsync(t => t.Id == model.Id);

            updateTest.Name = model.Name;
            updateTest.IdForView = model.IdForView;
            updateTest.SubjectId = model.SubjectId;

            var d = await _context.TestQuestions.Where(t => t.TestId == model.Id).ToListAsync();

            _context.TestQuestions.RemoveRange(d);

            await _context.SaveChangesAsync();

            await InsertTestQuestion(model.TestQuestions, model.Id);

            //foreach (var item in model.TestQuestions)
            //{
            //    int id = 0;
            //    if (item.Id == 0)
            //    {
            //         id = InsertTestQ(item,model.Id);
            //    }
            //    else
            //    {
            //        id = await UdpateTestQuestion(item);
            //    }

            //    foreach (var a in item.TestQuestionAnswer)
            //    {
            //        if (a.Id == 0)
            //        {
            //            if(id == 0)
            //                await InsertTestQA(a, a.TestQuestionId);
            //            else
            //                await InsertTestQA(a, id);
            //        }
            //        else
            //        {
            //            await UdpateTestQuestionAnswer(a);
            //        }
            //    }
            //}

            await _context.SaveChangesAsync();
        }

        [HttpPost]
        [Authorize]
        [Route("CreateTest")]
        //POST : /api/Test/CreateTest

        public async Task<Object> CreateTest(TestModel model)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var test = new Test()
            {
                Name = model.Name,
                OwnerId = userId,
                SubjectId = model.SubjectId,
                IdForView = model.IdForView
            };
            try
            {
                var result = await _context.Tests.AddAsync(test);
                await _context.SaveChangesAsync();

                var id = test.Id;

                await InsertTestQuestion(model.TestQuestions,id);

                return Ok(new { });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        protected async Task InsertTestQuestion(IList<TestQuestionModel> questions, int id)
        {
            for (int i = 0; i < questions.Count; i++)
            {
                var question = new TestQuestion
                {
                    Name = questions[i].Name,
                    TestId = id,
                    IdForView = questions[i].IdForView
                };

                await _context.TestQuestions.AddAsync(question);
                await _context.SaveChangesAsync();

                var Id = question.Id;

                await InsertTestQuestionAnswer(questions[i].TestQuestionAnswer, Id);
            }
        }

        protected async Task<int> UdpateTestQuestion(TestQuestionModel question)
        {
            var updateQuestion = await _context.TestQuestions.FirstOrDefaultAsync(q => q.Id == question.Id);

            int id = 0;

            if (updateQuestion != null)
            {
                updateQuestion.Name = question.Name;
                updateQuestion.IdForView = question.IdForView;
                await _context.SaveChangesAsync();

                id = updateQuestion.Id;
            }
            return id;
        }

        protected async Task UdpateTestQuestionAnswer(TestQuestionAnswerModel answer)
        {
            var updateAnswer = await _context.TestQuestionAnswers.FirstOrDefaultAsync(a => a.Id == answer.Id);

            if (updateAnswer != null)
            {
                updateAnswer.Name = answer.Name;
                updateAnswer.IsCorrect = answer.IsCorrect;
                updateAnswer.IdForView = answer.IdForView;
                await _context.SaveChangesAsync();
            }

        }

        protected async Task InsertTestQuestionAnswer(IList<TestQuestionAnswerModel> questionAnswers, int id)
        {
            for (int i = 0; i < questionAnswers.Count; i++)
            {
                var qestionAnswer = new TestQuestionAnswer
                {
                    Name = questionAnswers[i].Name,
                    IsCorrect = questionAnswers[i].IsCorrect,
                    TestQuestionId = id,
                    IdForView = questionAnswers[i].IdForView
                };

                await _context.TestQuestionAnswers.AddAsync(qestionAnswer);
                await _context.SaveChangesAsync();
            }
        }

        protected async Task InsertTestQA(TestQuestionAnswerModel questionAnswers, int id)
        {
            var questionAnswer = new TestQuestionAnswer
            {
                Name = questionAnswers.Name,
                IsCorrect = questionAnswers.IsCorrect,
                TestQuestionId = id,
                IdForView = questionAnswers.IdForView
            };

            await _context.TestQuestionAnswers.AddAsync(questionAnswer);
            await _context.SaveChangesAsync();
        }

        protected int InsertTestQ(TestQuestionModel questions, int id)
        {
            var question = new TestQuestion
            {
                Name = questions.Name,
                TestId = id,
                IdForView = questions.IdForView

            };

            _context.TestQuestions.Add(question);
            _context.SaveChanges();

            int Id = question.Id;

            return Id;
        }

        [HttpGet]
        [Authorize]
        [Route("GetById")]
        //GET : /api/Test/GetById

        public async Task<TestModel> GetById(int id)
        {
            //var test = await _context.Tests.Where(t => t.Id == id).FirstOrDefaultAsync();
            var test = await _context.Tests.Include(t => t.SubjectFk).Where(t => t.Id == id).FirstOrDefaultAsync();

            var ret = new TestModel();

            ret.Id = test.Id;
            ret.Name = test.Name;
            ret.IdForView = test.IdForView;
            ret.SubjectId = test.SubjectId;
            ret.SubjectName = test.SubjectFk == null ? "" : test.SubjectFk.Name;
            ret.TestQuestions = GetAllTestQuestionById(test.Id);
            
            return ret;
        }

        protected List<TestQuestionModel> GetAllTestQuestionById(int id)
        {
            var question = _context.TestQuestions.Where(t => t.TestId == id);

            var questionArr = new List<TestQuestionModel>();

            foreach (var item in question)
            {
                var q = new TestQuestionModel();
                q.Name = item.Name;
                q.Id = item.Id;
                q.TestId = item.TestId;
                q.IdForView = item.IdForView;
                q.TestQuestionAnswer = GetAllTestQuestionAnswerById(item.Id);
                questionArr.Add(q);
            }

            return questionArr;

        }

        protected List<TestQuestionAnswerModel> GetAllTestQuestionAnswerById(int id)
        {
            var answer = _context.TestQuestionAnswers.Where(t => t.TestQuestionId == id);

            var answerArr = new List<TestQuestionAnswerModel>();

            foreach (var item in answer)
            {
                var a = new TestQuestionAnswerModel();
                a.Name = item.Name;
                a.Id = item.Id;
                a.IsCorrect = item.IsCorrect;
                a.IdForView = item.IdForView;
                a.TestQuestionId = item.TestQuestionId;
                answerArr.Add(a);
            }

            return answerArr;

        }

        [HttpGet]
        [Authorize]
        [Route("GetAll")]
        //GET : /api/Test/GetAll
        public async Task<List<TestModel>> GetAll(string filterText)
        {
            var lst = await _context.Tests.Include(t => t.SubjectFk)
                .Where(t => (!string.IsNullOrWhiteSpace(filterText)) ? t.Name.Contains(filterText)
                || t.SubjectFk.Name.Contains(filterText)
                 : true)
                .ToListAsync();

            var tests = new List<TestModel>();

            foreach (var item in lst)
            {
                var test = new TestModel
                {
                    Id = item.Id,
                    Name = item.Name,
                    IdForView = item.IdForView,
                    SubjectName = item.SubjectFk.Name,
                    AmountTestQuestions = _context.TestQuestions.Where(q => q.TestId == item.Id).Select(q => q).Count()
                };

                tests.Add(test);
            }

            return tests;
        }

        [HttpGet]
        [Authorize]
        [Route("GetAllForUser")]
        //GET : /api/Test/GetAllForUser
        public async Task<List<TestModel>> GetAllForUser(string filterText)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var lst = await _context.Tests.Include(t => t.SubjectFk)
                .Where(t => t.OwnerId == userId)
                .Where(t => (!string.IsNullOrWhiteSpace(filterText)) ? t.Name.Contains(filterText)
                || t.SubjectFk.Name.Contains(filterText)
                 : true)
                .ToListAsync();

            var tests = new List<TestModel>();

            foreach (var item in lst)
            {
                var test = new TestModel
                {
                    Id = item.Id,
                    Name = item.Name,
                    IdForView = item.IdForView,
                    SubjectName = item.SubjectFk.Name,
                    AmountTestQuestions = _context.TestQuestions.Where(q => q.TestId == item.Id).Select(q => q).Count()
                };

                tests.Add(test);
            }

            return tests;
        }

        [HttpGet]
        [Authorize(Roles = "Student")]
        [Route("GetAllForStudent")]
        //GET : /api/Test/GetAllForStudent
        public async Task<List<TestModel>> GetAllForStudent(string filterText)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var subjects = await _context.StudentSubjects.Where(s => s.StudentId == userId && s.IsSubscribe == true).ToListAsync();

            var lst = new List<TestModel>();

            foreach (var s in subjects)
            {
                var list = await _context.Tests.Include(l => l.SubjectFk)
                    .Where(l => l.SubjectId == s.SubjectId)
                    .Where(t => (!string.IsNullOrWhiteSpace(filterText)) ? t.Name.Contains(filterText)
                    || t.SubjectFk.Name.Contains(filterText)
                    : true)
                    .ToListAsync();

                foreach (var item in list)
                {
                    var test = new TestModel();
                    test.Id = item.Id;
                    test.Name = item.Name;
                    test.OwnerId = item.OwnerId;
                    test.SubjectName = item.SubjectFk.Name;
                    test.IdForView = item.IdForView;
                    //test.AmountTestQuestions = _context.TestQuestions.Where(q => q.TestId == item.Id).Select(q => q).Count();

                    lst.Add(test);
                }
            }

            return lst;
        }

        [HttpDelete]
        [Authorize]
        [Route("Delete")]
        //Delete : /api/Test/Delete
        public async Task Delete(int id)
        {
            var deleteItem = await _context.Tests.FirstOrDefaultAsync(t => t.Id == id);

            if (deleteItem != null)
            {
                _context.Tests.Remove(deleteItem);
                await _context.SaveChangesAsync();
            }
        }

        [HttpPost]
        [Authorize]
        [Route("CheckTest")]
        //POST : /api/Test/CheckTest

        public async Task<double> CheckTest(TestModel test)
        {
            var t = await _context.Tests.Where(t => t.Id == test.Id).FirstOrDefaultAsync();

            var testBase = new TestModel
            {
                Id = t.Id,
                Name = t.Name,
                IdForView = t.IdForView,
                TestQuestions = GetAllTestQuestionById(t.Id)
            };

            for (int i = 0; i < testBase.TestQuestions.Count(); i++)
            {
                testBase.TestQuestions[i].TestQuestionAnswer = new List<TestQuestionAnswerModel>();

                var answer = _context.TestQuestionAnswers.Where(t => t.TestQuestionId == testBase.TestQuestions[i].Id && t.IsCorrect == true);

                foreach (var item in answer)
                {
                    var a = new TestQuestionAnswerModel();
                    a.Name = item.Name;
                    a.Id = item.Id;
                    a.IsCorrect = item.IsCorrect;
                    a.IdForView = item.IdForView;
                    a.TestQuestionId = item.TestQuestionId;
                    testBase.TestQuestions[i].TestQuestionAnswer.Add(a);
                }
            }

            //CheckTest

            double ball = 0;
            double b1 = 100.0/test.TestQuestions.Count();

            foreach (var i in testBase.TestQuestions)
            {
                foreach (var j in test.TestQuestions )
                {
                    if (i.Name == j.Name)
                    {
                        double lenght = i.TestQuestionAnswer.Count();
                        double c = 1 / lenght;
                        double b = 0.0;

                        foreach (var ii in i.TestQuestionAnswer)
                        {
                            foreach (var jj in j.TestQuestionAnswer)
                            {
                                if (ii.Name == jj.Name)
                                {
                                    if (ii.IsCorrect == true && jj.IsCorrect == true)
                                    {
                                        b += 1;
                                    }
                                }
                                else if (ii.Name != jj.Name)
                                {
                                    var trueVar = i.TestQuestionAnswer.Any(j => jj.Name == j.Name);
                                    if (trueVar == false && jj.IsCorrect == true)
                                    {
                                        b = b - c;
                                    }
                                }
                            }
                        }

                        double count  = 0.0;
                        if(b > 0)
                            count = b / lenght;

                        ball += count;
                    }
                }
            }
            ball = ball * b1;

            return ball;

        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestDiplom.Models;

namespace TestDiplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        public UserProfileController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        
        
        [HttpGet]
        [Authorize]
        //Get : /api/UserProfile
        public async Task<ApplicationUserModel> GetUserProfile()
        {
            string userId = User.Claims.FirstOrDefault(c => c.Type == "UserID").Value;

            var user = await _userManager.FindByIdAsync(userId);

            var a = new ApplicationUserModel
            {
                FullName = user.FullName,
                Email = user.Email,
                UserName = user.UserName,
                imgPath = user.ImgPath
            };

            return a;
        }

        [HttpPost]
        [Authorize]
        [Route("Update")]
        //POST : /api/UserProfile/Update

        public async Task<IActionResult> EditUserProfile(ApplicationUserModel userProfile)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            var user = await _userManager.FindByIdAsync(userId);

            user.FullName = userProfile.FullName;
            user.Email = userProfile.Email;
            user.UserName = userProfile.UserName;
            user.ImgPath = userProfile.imgPath;
            try
            {
                var result = await _userManager.UpdateAsync(user);

                return Ok(result);
            }
            
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}

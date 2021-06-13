using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace TestDiplom.Models.SendMessage
{
    public class SendMessage:ISendMessage
    {
        public void SendMessageToMail(string email, string message, string fullNameTo, string letterHeader, bool isHTML) 
        {
            try 
            {
                SmtpClient mySmtpClient = new SmtpClient("mail.hosting.reg.ru", 25);

                mySmtpClient.UseDefaultCredentials = false;
                mySmtpClient.EnableSsl = true;

                NetworkCredential basicAuthenticationInfo = new NetworkCredential("diplom@sh-akashov.ru", "Ashsh0010");
                mySmtpClient.Credentials = basicAuthenticationInfo;

                MailAddress from = new MailAddress("diplom@sh-akashov.ru", "Diplom Application");
                MailAddress to = new MailAddress(email, fullNameTo);
                MailMessage myMail = new MailMessage(from, to);

                MailAddress replyTo = new MailAddress("diplom@sh-akashov.ru");
                myMail.ReplyToList.Add(replyTo);

                myMail.Subject = letterHeader;
                myMail.SubjectEncoding = Encoding.UTF8;

                myMail.Body = message;
                if(isHTML == false)
                    myMail.BodyEncoding = Encoding.UTF8;
                myMail.IsBodyHtml = isHTML;

                mySmtpClient.Send(myMail);
            }
            catch (SmtpException ex)
            {
                throw new ApplicationException("SmtpException " + ex.Message);
            }
            catch (Exception ex) 
            {
                throw ex;
            }
        }
    }
}

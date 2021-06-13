using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestDiplom.Models.SendMessage
{
    public interface ISendMessage
    {
        void SendMessageToMail(string email, string message, string fullNameTo,string letterHeader, bool isHTML);
    }
}

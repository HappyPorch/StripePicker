using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StripePicker.Backoffice.ViewModel
{
    public class PlanView
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string ProductId { get; set; }
        public string Currency { get; internal set; }
        public long? Amount { get; internal set; }
        public string Interval { get; internal set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StripePicker.Backoffice.ViewModel
{
    public class TaxRateView
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public decimal Percentage { get; set; }
    }
}

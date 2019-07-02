using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StripePicker.Backoffice.ViewModel
{
    public class CouponView
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public long? AmountOff { get; set; }
        public decimal? PercentOff { get; set; }
        public string Currency { get; set; }
    }
}

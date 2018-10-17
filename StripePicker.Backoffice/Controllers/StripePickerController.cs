using Stripe;
using StripePicker.Backoffice.ViewModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Umbraco.Web.Editors;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace StripePicker.Backoffice.Controllers
{
    [PluginController("StripePickerPlugin")]
    public class StripePickerController : UmbracoAuthorizedApiController
    {
        //  /umbraco/backoffice/StripePickerPlugin/StripePicker/GetProducts
        [HttpGet]
        public IEnumerable<ProductView> GetProducts()
        {
            var stripeApiKey = ConfigurationManager.AppSettings["StripePicker.StripeApiKey"];
            StripeConfiguration.SetApiKey(stripeApiKey);

            var productService = new StripeProductService();
            StripeList<StripeProduct> productItems = productService.List(
              new StripeProductListOptions()
              {
                  Limit = 10
              }
            );

            var jsonProducts = productItems
                .Select(p => new ProductView { Id = p.Id, Name = p.Name });

            //var jsonProducts = new List<ProductView>();
            //jsonProducts.Add(new ProductView { Id = "prod_DnOwteuIbOYyFB", Name = "product1" });
            //jsonProducts.Add(new ProductView { Id = "prod_DnrgRBTTtnnb", Name = "product2" });

            return jsonProducts;
        }

        //  /umbraco/backoffice/StripePickerPlugin/StripePicker/GetPlans
        [HttpGet]
        public IEnumerable<PlanView> GetPlans()
        {
            var jsonPlans = new List<PlanView>();
            jsonPlans.Add(new PlanView { Id = "plan_DnOxxh34lSVMtL", Name = "plan1", Product= "prod_DnOwteuIbOYyFB" });
            jsonPlans.Add(new PlanView { Id = "plan_rebrtbTRerg3", Name = "plan2", Product = "prod_DnrgRBTTtnnb" });

            return jsonPlans;
        }
    }
}

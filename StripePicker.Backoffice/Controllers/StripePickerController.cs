using Stripe;
using StripePicker.Backoffice.ViewModel;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Mvc;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace StripePicker.Backoffice.Controllers
{
    [PluginController("StripePickerPlugin")]
    public class StripePickerController : UmbracoAuthorizedApiController
    {
        private const int _maximumItemsToReturn = 20;
        /// <summary>
        /// /umbraco/backoffice/StripePickerPlugin/StripePicker/GetProducts
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<ProductView> GetProducts()
        {
            SetStripeKey();
            var productService = new StripeProductService();
            StripeList<StripeProduct> productItems = productService.List(
              new StripeProductListOptions()
              {
                  Limit = _maximumItemsToReturn
              }
            );

            var jsonProducts = productItems
                .Select(p => new ProductView { Id = p.Id, Name = p.Name, Type = p.Type });

            return jsonProducts;
        }

        /// <summary>
        /// /umbraco/backoffice/StripePickerPlugin/StripePicker/GetPlans
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<PlanView> GetPlans()
        {
            SetStripeKey();
            var planService = new StripePlanService();
            StripeList<StripePlan> planItems = planService.List(
              new StripePlanListOptions()
              {
                  Limit = _maximumItemsToReturn
              }
            );
            var jsonPlans = planItems
                .Select(p => new PlanView { Id = p.Id, Name = p.Nickname, Currency = p.Currency, Amount = p.Amount, Interval = p.Interval, ProductId = p.ProductId })
                .ToList();

            return jsonPlans;
        }

        /// <summary>
        /// /umbraco/backoffice/StripePickerPlugin/StripePicker/GetSkus
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<SkuView> GetSkus()
        {
            SetStripeKey();
            var skuService = new StripeSkuService();
            StripeList<StripeSku> skuItems = skuService.List(
              new StripeSkuListOptions
              {
                  Limit = _maximumItemsToReturn
              }
            );

            var jsonProducts = skuItems
                .Select(p => new SkuView { Id = p.Id, Price = p.Price, ProductId = p.ProductId, Currency = p.Currency });

            return jsonProducts;
        }

        private static void SetStripeKey()
        {
            var stripeApiKey = ConfigurationManager.AppSettings["StripePicker.StripeApiKey"];
            StripeConfiguration.SetApiKey(stripeApiKey);
        }
    }
}

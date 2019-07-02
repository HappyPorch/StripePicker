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
        private const int _maximumItemsToReturn = 50;
        /// <summary>
        /// /umbraco/backoffice/StripePickerPlugin/StripePicker/GetProducts
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<ProductView> GetProducts()
        {
            SetStripeKey();
            var productService = new ProductService();
            StripeList<Product> productItems = productService.List(
              new ProductListOptions()
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
            var planService = new PlanService();
            StripeList<Plan> planItems = planService.List(
              new PlanListOptions()
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
            var skuService = new SkuService();
            StripeList<Sku> skuItems = skuService.List(
              new SkuListOptions
              {
                  Limit = _maximumItemsToReturn
              }
            );

            var jsonProducts = skuItems
                .Select(p => new SkuView { Id = p.Id, Price = p.Price, ProductId = p.ProductId, Currency = p.Currency });

            return jsonProducts;
        }

        /// <summary>
        /// /umbraco/backoffice/StripePickerPlugin/StripePicker/GetCoupons
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<CouponView> GetCoupons()
        {
            SetStripeKey();
            var couponService = new CouponService();
            StripeList<Coupon> couponItems = couponService.List(
              new CouponListOptions
              {
                  Limit = _maximumItemsToReturn,
              }
            );

            var jsonProducts = couponItems
                .Where(c => c.Valid)
                .Select(p => new CouponView { Id = p.Id, Name = p.Name, AmountOff = p.AmountOff, PercentOff = p.PercentOff, Currency = p.Currency });

            return jsonProducts;
        }

        private static void SetStripeKey()
        {
            var stripeApiKey = ConfigurationManager.AppSettings["StripePicker.StripePrivateApiKey"];
            StripeConfiguration.ApiKey = stripeApiKey;
        }
    }
}

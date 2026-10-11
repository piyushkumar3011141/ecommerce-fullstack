import { Route, Routes } from "react-router-dom";

import Account from "../../Navbarcomponents/Account";
import Product from "../../Navbarcomponents/Product";
import Wishlist from "../../Navbarcomponents/Wishlist";
import Carts from "../../Navbarcomponents/Carts";
import Orders from "../../Navbarcomponents/Orders";
import Address from "../../Navbarcomponents/Address";
import AccountSetting from "../../Navbarcomponents/AccountSetting";
import ImportProducts from "../../../ImportProducts";

import Nav from "../Nav/Nav";
import Slide from "../pagesilde/Slide";
import Card from "../card/Card";
import Multiplecard from "../Multiplecard/Multiplecard";
import Sign from "../Sign/Sign";
import Back from "../back/Back";

import Outletnavbar from "../../Outletfolder/Outletnavbar";
import Logout from "../../Navbarcomponents/Logout";
import Payment from "../../Navbarcomponents/Payment";
import Loginandsecurity from "../../Navbarcomponents/Loginandsecurity";

import Fashion from "../ShopItem/Fashion";
import AllProducts from "../ShopItem/Allproduct";
import Electronics from "../ShopItem/Electronics";
import Beauty from "../ShopItem/Beauty";
import HomeLiving from "../ShopItem/HomeLiving";
import Deals from "../ShopItem/DealOffers";
import FeaturedProducts from "../ShopItem/Featured";
import Books from "../ShopItem/Books";
import SportsFitness from "../ShopItem/SportsFitness";
import ToysKids from "../ShopItem/ToysKids";
import NewArrivals from "../ShopItem/NewArrivals";

import Firstpage from "../pagesildeitem/Firstpage";
import Secondpage from "../pagesildeitem/Secondpage";
import Thirdpage from "../pagesildeitem/Thirdpage";

import ProductDetail from "../ProductDetail/ProductDetail";
import SearchResults from "../SearchResults/SearchResults";

import SitePage from "../SitePage/SitePage";
import Contact from "../SitePage/Contact";
import AdminPanel from "../Admin/AdminPanel";
import ProductCard from "../ProductCard/ProductCard";
import RequireLogin from "../RequireLogin/RequireLogin";

export default function Routenavbar() {
  return (
    <Routes>

      <Route path="/" element={<Outletnavbar />}>

        {/* HOME PAGE */}
        <Route
          index
          element={
            <>
              <Slide />
              <Nav />
              <Card />
              <Multiplecard />
              <Sign />
              <Back />
            </>
          }
        />

        {/* IMPORT ALL PRODUCTS */}
        <Route
          path="import-products"
          element={
            <RequireLogin admin>
              <ImportProducts />
            </RequireLogin>
          }
        />

        {/* ADMIN PANEL */}
        <Route
          path="admin"
          element={
            <RequireLogin admin>
              <AdminPanel />
            </RequireLogin>
          }
        />

        {/* FOOTER PAGES (content backend se) */}
        <Route path="page/:slug" element={<SitePage />} />
        <Route path="contact" element={<Contact />} />

        {/* PRODUCT (ALL PRODUCTS) */}
        <Route
          path="product"
          element={<Product />}
        />

        {/* PRODUCT DETAIL */}
        <Route
          path="productdetail/:id"
          element={<ProductDetail />}
        />

        {/* SEARCH */}
        <Route
          path="search"
          element={<SearchResults />}
        />

        {/* WISHLIST */}
        <Route
          path="wishlist"
          element={<Wishlist />}
        />

        {/* ACCOUNT */}
        <Route
          path="account"
          element={<Account />}
        />

        {/* CART */}
        <Route
          path="cart"
          element={<Carts />}
        />

        {/* ORDERS */}
        <Route
          path="orders"
          element={
            <RequireLogin>
              <Orders />
            </RequireLogin>
          }
        />

        {/* ADDRESS */}
        <Route
          path="address"
          element={
            <RequireLogin>
              <Address />
            </RequireLogin>
          }
        />

        {/* LOGOUT */}
        <Route
          path="logout"
          element={<Logout />}
        />

        {/* PAYMENT */}
        <Route
          path="payment"
          element={
            <RequireLogin>
              <Payment />
            </RequireLogin>
          }
        />

        {/* LOGIN AND SECURITY */}
        <Route
          path="loginandsecurity"
          element={<Loginandsecurity />}
        />

        {/* ACCOUNT SETTINGS */}
        <Route
          path="settings"
          element={<AccountSetting />}
        />

        {/* SHOP CATEGORIES */}
        <Route
          path="fashion"
          element={<Fashion />}
        />

        <Route
          path="allproduct"
          element={<AllProducts />}
        />

        <Route
          path="electronics"
          element={<Electronics />}
        />

        <Route
          path="beauty"
          element={<Beauty />}
        />

        <Route
          path="homeliving"
          element={<HomeLiving />}
        />

        <Route
          path="deals"
          element={<Deals />}
        />

        <Route
          path="featuredproducts"
          element={<FeaturedProducts />}
        />

        <Route
          path="books"
          element={<Books />}
        />

        <Route
          path="sportsfitness"
          element={<SportsFitness />}
        />

        <Route
          path="toyskids"
          element={<ToysKids />}
        />

        <Route
          path="newarrivals"
          element={<NewArrivals />}
        />

        {/* SLIDER PAGES */}
        <Route
          path="firstpage"
          element={<Firstpage />}
        />

        <Route
          path="secondpage"
          element={<Secondpage />}
        />

        <Route
          path="thirdpage"
          element={<Thirdpage />}
        />

        {/* PRODUCT BY ID */}
        <Route
          path="product/:id"
          element={<Product />}
        />

      </Route>

    </Routes>
  );
}
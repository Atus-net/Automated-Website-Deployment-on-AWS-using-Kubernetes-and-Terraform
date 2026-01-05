import Home from "../pages/Home";
import GenImage from "../pages/Image Generator";
import About from "../pages/About/about";
import News from "../pages/News";
import Category from "../pages/Categories/category";
import Auth from "~/pages/authentication/auth";
import Policy from "~/pages/Policy";
import DetailedCake from "~/components/Layouts/components/DetailedCake";
import Condition from "~/pages/Condition";
import Cart from "~/components/Layouts/components/Cart";
import AccountPage from "~/pages/Account";
import AdminDashboard from "~/pages/AdminDashboard/dashboard";
import AdminLogin from "~/pages/AdminLogin";
import DefaultLayout from "~/components/Layouts/DefaultLayout";
import DashBoardLayout from "~/components/Layouts/DashboardLayout";
import AdminProduct from "~/pages/AdminProduct/product";
import AdminOrder from "~/pages/AdminOrder/order";
import AdminCustomer from "~/pages/AdminCustomer/customer";
import Payment from "~/components/Layouts/components/Payment";
import ThankYou from "~/components/Layouts/components/Payment/COD";
import EmailRecovery from "~/components/Layouts/components/Forgot Password/EmailRecovery";
import EmailSent from "~/components/Layouts/components/Forgot Password/EmailSent";
import NewPassword from "~/components/Layouts/components/Forgot Password/NewPassword";
import PaymentReturn from "~/components/Layouts/components/Payment/PaymentReturn";
import PaymentSuccess from "~/components/Layouts/components/Payment/PaymentSucess";
import PaymentFail from "~/components/Layouts/components/Payment/PaymentFail";
import Checkout from "~/components/Layouts/components/Checkout/Checkout";
import OrderSuccess from "~/components/Layouts/components/Payment/COD";
import NotFound from "~/pages/error";
// import Checkout from "~/components/Layouts/components/Checkout";
const publicRoute = [
  { path: "/", component: Home },
  // { path: "/generator", component: GenImage },
  { path: "/about", component: About },
  { path: "/news", component: News },
  { path: "/category", component: Category },
  { path: "/auth", component: Auth },
  { path: "/policy", component: Policy },
  { path: "/detailed/:id", component: DetailedCake },
  { path: "/condition", component: Condition },
  // { path: "/admin/login", component: AdminLogin, layout: null },
  { path: "/payment", component: Payment },
  { path: "/email/recovery", component: EmailRecovery },
  { path: "/email/message", component: EmailSent },
  { path: "/reset-password", component: NewPassword },
  { path: "/payment-return", component: PaymentReturn },
  { path: "/payment-success", component: PaymentSuccess },
  { path: "/payment-fail", component: PaymentFail },
  { path: "/order-success", component: OrderSuccess },
  {
    path: '/checkout',
    component: Checkout,
  },
  {path: '*', component: NotFound},
]

const privateRoute = [
  { path: "/admin/dashboard", component: AdminDashboard, layout: DashBoardLayout },
  { path: "/cart", component: Cart, layout: DefaultLayout },
  ...[
    "/account",
    "/account/profile",
    "/account/address",
    "/account/change-password",
    "/account/orders",
  ].map(path => ({ path, component: AccountPage, layout: DefaultLayout })),
  { path: "/admin/product_management", component: AdminProduct, layout: DashBoardLayout },
  { path: "/admin/order_management", component: AdminOrder, layout: DashBoardLayout },
  { path: "/admin/register_customer", component: AdminCustomer, layout: DashBoardLayout },
];

export { publicRoute, privateRoute };

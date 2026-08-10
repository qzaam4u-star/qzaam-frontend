import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import MenuPage from "./pages/MenuPage";
import FoodVendorPage from "./pages/FoodVendorPage";
import SalonVendorPage from "./pages/SalonVendorPage";
import VendorDiscoveryPage from "./pages/VendorDiscoveryPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VendorsPage from "./pages/admin/VendorsPage";
import OrdersPage from "./pages/admin/OrdersPage";
import CustomersPage from "./pages/admin/CustomersPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import CommissionPage from "./pages/admin/CommissionPage";
import ReportsPage from "./pages/admin/ReportsPage";
import ComplaintsPage from "./pages/admin/ComplaintsPage";
import ReferralsPage from "./pages/admin/ReferralsPage";
import ReviewsPage from "./pages/admin/ReviewsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import LogoutPage from "./pages/admin/LogoutPage";
import AdminChangePasswordPage from "./pages/admin/AdminChangePasswordPage";
import CustomerOrdersPage from "./pages/customer/CustomerOrdersPage";
import HelpDeskPage from "./pages/HelpDeskPage";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorMenuPage from "./pages/vendor/VendorMenuPage";
import CreateMenuPage from "./pages/vendor/CreateMenuPage";
import CartPage from "./pages/CartPage";
import ReferVendorPage from "./pages/ReferVendorPage";
import WalletPage from "./pages/customer/WalletPage";
import WishlistPage from "./pages/customer/WishlistPage";
import CustomerHub from "./pages/CustomerHub";
import AboutPage from "./pages/AboutPage";
import BookingStatusPage from "./pages/BookingStatusPage";
import VendorServicesPage from "./pages/vendor/VendorServicesPage";
import VendorProfilePage from "./pages/vendor/VendorProfilePage";
import UploadImagesPage from "./pages/vendor/UploadImagesPage";
import CustomerProtectedRoute from "./components/CustomerProtectedRoute";
import TermsPage from "./pages/legal/TermsPage";
import PrivacyPage from "./pages/legal/PrivacyPage";
import RefundPage from "./pages/legal/RefundPage";
import DisclaimerPage from "./pages/legal/DisclaimerPage";
import FaqPage from "./pages/support/FaqPage";
import ReportIssuePage from "./pages/support/ReportIssuePage";
import ContactPage from "./pages/support/ContactPage";
import ScrollToTop from "./components/ScrollToTop";
import Offerspage from "./pages/offerspage";
import Adminofferspage from "./pages/admin/adminofferspage";
import VendorAnnouncements from "./pages/vendor/vendorannouncements";
import SalonBookingPage from "./pages/SalonBookingPage";
import VendorCreateCampaign from "./pages/VendorCreateCampaign";
import InfluencerProfilePage from "./pages/InfluencerProfilePage";
import CampaignsPage from "./pages/CampaignsPage";
import CampaignCategoryPage from "./pages/CampaignCategoryPage";

function ProtectedRoute({ children, roleRequired }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
}
function CampaignEntry() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role === "vendor") {
    return <Navigate to="/vendor/campaigns/create" replace />;
  }

  if (user?.role === "influencer") {
    return <Navigate to="/influencer/campaigns" replace />;
  }

  return <Navigate to="/" replace />;
}
function AppLayout() {
  const location = useLocation();

  const isCampaignPage = location.pathname.startsWith("/campaigns");

  return (
    <>
      {!isCampaignPage && <Navbar />}

      <div className="flex-grow">
        <Routes>
          {/* YOUR EXISTING ROUTES WILL STAY HERE */}
        </Routes>
      </div>

      <Footer />
    </>
  );
}
export default function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <Routes>
                  {/* ── Public Routes ────────────────────────────────────────────────── */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route
                    path="/menu/food"
                    element={<VendorDiscoveryPage serviceFilter="food" />}
                  />
                  <Route
                    path="/menu/salon"
                    element={<VendorDiscoveryPage serviceFilter="salon" />}
                  />
                  <Route
  path="/campaigns"
  element={<CampaignCategoryPage />}
/>

                  {/* ── Vendor Routes by Type ──────────────────────────────────────────── */}
                  <Route
                    path="/menu/food/:vendorId"
                    element={<FoodVendorPage />}
                  />
                  <Route
                    path="/menu/salon/:vendorId"
                    element={<SalonVendorPage />}
                  />
                  <Route
                    path="/menu/salon-booking/:vendorId"
                    element={<SalonBookingPage />}
                  />


                  {/* ── Cart & Order Routes ────────────────────────────────────────────── */}
                  <Route path="/cart" element={<CartPage />} />

                  {/* ── Order & Booking Routes ─────────────────────────────────────────── */}
                  <Route path="/order-status" element={<OrderStatusPage />} />
                  <Route
                    path="/order-status/:id"
                    element={<OrderStatusPage />}
                  />
                  <Route
                    path="/booking-status"
                    element={<BookingStatusPage />}
                  />
                  <Route
                    path="/booking-status/:id"
                    element={<BookingStatusPage />}
                  />
                  <Route path="/your-orders" element={<CustomerOrdersPage />} />
                  <Route path="/help-desk" element={<HelpDeskPage />} />

                  {/* ── Customer Protected Routes ──────────────────────────────────────── */}
                  <Route
                    path="/refer-vendor"
                    element={
                      <CustomerProtectedRoute>
                        <ReferVendorPage />
                      </CustomerProtectedRoute>
                    }
                  />
                  <Route
                    path="/refer"
                    element={
                      <CustomerProtectedRoute>
                        <ReferVendorPage />
                      </CustomerProtectedRoute>
                    }
                  />
                  <Route
                    path="/wallet"
                    element={
                      <CustomerProtectedRoute>
                        <WalletPage />
                      </CustomerProtectedRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <CustomerProtectedRoute>
                        <WishlistPage />
                      </CustomerProtectedRoute>
                    }
                  />

                  {/* ── Information & Support Routes ───────────────────────────────────── */}
                  <Route path="/customer-hub" element={<CustomerHub />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/refund" element={<RefundPage />} />
                  <Route path="/disclaimer" element={<DisclaimerPage />} />
                  <Route path="/faqs" element={<FaqPage />} />
                  <Route path="/report-issue" element={<ReportIssuePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/offers" element={<Offerspage />} />

                  {/* ── Auth Routes ────────────────────────────────────────────────────── */}
                  <Route path="/auth" element={<LoginPage />} />
                  <Route path="/auth/register" element={<RegisterPage />} />
                  <Route path="/vendor/register" element={<RegisterPage />} />

                  {/* ── Admin Routes ───────────────────────────────────────────────────── */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/vendors"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <VendorsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/offers"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <Adminofferspage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/customers"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <CustomersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/payments"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <PaymentsPage />
                      </ProtectedRoute>
                    }
                  />
                  {/*<Route
  path="/admin/campaigns"
  element={
    <ProtectedRoute roleRequired="admin">
      <AdminCampaigns />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/influencers"
  element={
    <ProtectedRoute roleRequired="admin">
      <AdminInfluencers />
    </ProtectedRoute>
  }
/>*/}
                  <Route
                    path="/admin/commission"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <CommissionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/reports"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <ReportsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/complaints"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <ComplaintsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/referrals"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <ReferralsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/reviews"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <ReviewsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/admin/logout" element={<LogoutPage />} />
                  <Route
                    path="/admin/change-password"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <AdminChangePasswordPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Influencer Routes ─────────────────────────────────────────────── */}

<Route
  path="/influencer/profile"
  element={
    <ProtectedRoute roleRequired="influencer">
      <InfluencerProfilePage />
    </ProtectedRoute>
  }
/>

<Route
  path="/influencer/campaigns"
  element={
    <ProtectedRoute roleRequired="influencer">
      <CampaignsPage />
    </ProtectedRoute>
  }
/>

{/* ── Vendor Routes ─────────────────────────────────────────────────── */}

                  {/* ── Vendor Routes ──────────────────────────────────────────────────── */}
                  <Route
                    path="/vendor/dashboard"
                    element={
                      <ProtectedRoute roleRequired="vendor">
                        <VendorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/vendor/menu"
                    element={
                      <ProtectedRoute roleRequired="vendor">
                        <VendorMenuPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/vendor/menu/create"
                    element={
                      <ProtectedRoute roleRequired="vendor">
                        <CreateMenuPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/vendor/services"
                    element={
                      <ProtectedRoute roleRequired="vendor">
                        <VendorServicesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/vendor/profile"
                    element={
                      <ProtectedRoute roleRequired="vendor">
                        <VendorProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/upload-images"
                    element={
                      <ProtectedRoute roleRequired="vendor">
                        <UploadImagesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                      path="/vendor/announcements"
                      element={<VendorAnnouncements />}
                   />
                 <Route
                      path="/vendor/campaigns/create"
                      element={
                     <ProtectedRoute roleRequired="vendor">
                     <VendorCreateCampaign />
                     </ProtectedRoute>
                    }
                 />

                  {/* Salon Redirects for Food Vendors */}
                  <Route
                    path="/vendor/stylists"
                    element={<Navigate to="/vendor/dashboard" replace />}
                  />
                  <Route
                    path="/salon-bookings"
                    element={<Navigate to="/vendor/dashboard" replace />}
                  />
                  <Route
                    path="/manage-services"
                    element={<Navigate to="/vendor/dashboard" replace />}
                  />

                  {/* ── Fallback Route ─────────────────────────────────────────────────── */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import { AppContextProvider } from "./contexts/AppContext";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/Navbar";
import CoursesList from "./pages/CoursesList";
import CourseDetails from "./pages/CourseDetails";
import MyEnrollments from "./pages/MyEnrollments";
import LogIn from "./pages/LogIn";
import "bootstrap/dist/css/bootstrap.min.css";
import SignUp from "./pages/SignUp";
import ProfilePage from "./pages/Profile";
import Cart from "./pages/Cart";
import PaymentSuccess from "./pages/PaymentSuccess";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<BrowserRouter>
			<AppContextProvider>
				<CartProvider>
					{/* header */}
					<Navbar />

					<Routes>
						<Route path="/" element={<Home />} />

						<Route path="/course-list" element={<CoursesList />} />
						<Route path="/course/:courseId" element={<CourseDetails />} />
						<Route path="/cart" element={<Cart />} />
						<Route path="/payment-success" element={<PaymentSuccess />} />

						<Route path="/my-enrollments" element={<MyEnrollments />} />
						<Route path="/profile" element={<ProfilePage />} />

						<Route path="/login" element={<LogIn />} />
						<Route path="/signup" element={<SignUp />} />
						{/* <Route path="/forgot-password" element={<LogIn />} /> */}

						{/* <Route path="*" element={<Home />} /> */}
					</Routes>

					<Footer />

					{/* Toast Container for notifications */}
					<ToastContainer
						position="top-right"
						autoClose={3000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
					/>
				</CartProvider>
			</AppContextProvider>
		</BrowserRouter>
	);
}

export default App;

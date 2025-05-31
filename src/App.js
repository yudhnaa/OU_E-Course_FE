import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import { AppContextProvider } from "./contexts/AppContext";
import Navbar from "./components/Navbar";
import CoursesList from "./pages/CoursesList";
import CourseDetails from "./pages/CourseDetails";
import MyEnrollments from "./pages/MyEnrollments";
import LogIn from "./pages/LogIn";
import "bootstrap/dist/css/bootstrap.min.css";
import SignUp from "./pages/SignUp";
import ProfilePage from "./pages/ProfilePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExerciseDetails from "./pages/ExerciseDetails";
import ExerciseAttempt from "./pages/ExerciseAttempt";

function App() {
	return (
		<BrowserRouter>
			<AppContextProvider>
				{/* header */}
				<Navbar />

				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/course-list" element={<CoursesList />} />
					<Route path="/course/:courseId" element={<CourseDetails />} />
					<Route path="/courses/:courseId/exercises/:exerciseId" element={<ExerciseDetails />} />
					<Route path="/courses/:courseId/exercises/:exerciseId/attempt" element={<ExerciseAttempt />} />
					<Route path="/my-enrollments" element={<MyEnrollments />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/login" element={<LogIn />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/forgot-password" element={<LogIn />} />
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
			</AppContextProvider>
		</BrowserRouter>
	);
}

export default App;

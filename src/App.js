import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import { AppContextProvider } from "./contexts/AppContext";
import Navbar from "./components/Navbar";
import CoursesList from "./pages/CoursesList";
import MyEnrollments from "./pages/MyEnrollments";
import SignIn from "./pages/SignIn";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
	return (
		<BrowserRouter>
			<AppContextProvider>
				{/* header */}
				<Navbar />

				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/course-list" element={<CoursesList />} />
					<Route path="/my-enrollments" element={<MyEnrollments />} />
					<Route path="/login" element={<SignIn />} />
					<Route path="/signup" element={<SignIn />} />
					<Route path="/forgot-password" element={<SignIn />} />
					{/* <Route path="*" element={<Home />} /> */}
				</Routes>

				<Footer />
			</AppContextProvider>
		</BrowserRouter>
	);
}

export default App;

import CallToAction from "../components/CallToAction";
import Companies from "../components/Companies";
import CoursesSection from "../components/CoursesSection";
import Hero from "../components/Hero";
import TestimonialsSection from "../components/TestimonialsSection";

const Home = () => {
	return (
		<div
			className="d-flex flex-column align-items-center text-center"
			style={{
				background:
					"linear-gradient(to bottom, rgba(13, 202, 240, 0.25), white)",
			}}
		>
			<Hero />
			<div className="py-4">
				<Companies />
			</div>
			<div className="py-4">
				<CoursesSection />
			</div>
			<div className="py-4">
				<TestimonialsSection />
			</div>
			<div className="py-4">
				<CallToAction />
			</div>
		</div>
	);
};

export default Home;

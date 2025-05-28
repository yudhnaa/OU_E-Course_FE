import CallToAction from "../components/CallToAction";
import Companies from "../components/Companies";
import CoursesSection from "../components/CoursesSection";
import Hero from "../components/Hero";
import TestimonialsSection from "../components/TestimonialsSection";

const Home = () => {
	return (
		<div className="flex flex-col items-center space-y-7 text-center">
			<Hero />
			<Companies />
			<CoursesSection />
			<TestimonialsSection />
			<CallToAction />
		</div>
	);
};

export default Home;

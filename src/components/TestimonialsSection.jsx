import React from "react";
import { assets, dummyTestimonial } from "../assets/assets";

const TestimonialsSection = () => {
	return (
		<div className="pb-5 px-3 px-md-0">
			<h2 className="h2 fw-medium text-dark">Testimonials</h2>
			<p className="text-muted mt-3">
				Hear from our learners as they share their journeys of transformation,
				success, and how our <br /> platform has made a difference in their
				lives.
			</p>
			<div className="row g-4 mt-4">
				{dummyTestimonial.map((testimonial, index) => (
					<div key={index} className="col-12 col-md-6 col-lg-4">
						<div className="card h-100 border-light shadow-sm">
							<div className="card-header bg-light border-0 d-flex align-items-center gap-3 py-3">
								<img
									className="rounded-circle"
									style={{ width: "48px", height: "48px" }}
									src={testimonial.image}
									alt={testimonial.name}
								/>
								<div>
									<h5 className="card-title mb-1 fw-medium text-dark">
										{testimonial.name}
									</h5>
									<p className="card-text text-muted small mb-0">
										{testimonial.role}
									</p>
								</div>
							</div>
							<div className="card-body">
								<div className="d-flex gap-1 mb-3">
									{[...Array(5)].map((_, i) => (
										<img
											className="img-fluid"
											style={{ height: "20px" }}
											key={i}
											src={
												i < Math.floor(testimonial.rating)
													? assets.star
													: assets.star_blank
											}
											alt="star"
										/>
									))}
								</div>
								<p className="text-muted">{testimonial.feedback}</p>
							</div>
							<div className="card-footer bg-transparent border-0 pt-0">
								<a href="#" className="text-primary text-decoration-underline">
									Read more
								</a>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default TestimonialsSection;

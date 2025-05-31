import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const TestsSection = ({ tests }) => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    return (
        <>
            <h2 className="mb-4">Tests</h2>
            <div className="accordion" id="testAccordion">
                {tests.map((test, index) => (
                    <div className="accordion-item" key={`test-${test.id}`}>
                        <h2 className="accordion-header" id={`test-heading-${index}`}>
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#test-collapse-${index}`}
                                aria-expanded="false"
                                aria-controls={`test-collapse-${index}`}
                            >
                                {test.name}
                            </button>
                        </h2>
                        <div
                            id={`test-collapse-${index}`}
                            className={`accordion-collapse collapse`}
                            aria-labelledby={`test-heading-${index}`}
                            data-bs-parent="#testAccordion"
                        >
                            <div className="accordion-body">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{test.name}</h5>
                                        <p className="card-text">{test.description}</p>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item">
                                                <strong>Duration:</strong> {test.durationMinutes} minutes
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Max Score:</strong> {test.maxScore}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Created:</strong> {new Date(Date.UTC(...test.createdAt)).toLocaleDateString()}
                                            </li>
                                        </ul>
                                        <div className="mt-3">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => navigate(`/courses/${courseId}/tests/${test.id}`)}
                                            >
                                                View Test
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default TestsSection;
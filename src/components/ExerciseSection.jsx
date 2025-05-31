import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ExercisesSection = ({ exercises }) => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const groupedExercises = exercises?.reduce((acc, exercise) => {
        const lessonName = exercise.lessonIdName || "Other";
        if (!acc[lessonName]) {
            acc[lessonName] = [];
        }
        acc[lessonName].push(exercise);
        return acc;
    }, {}) || {};

    return (
        <>
            <h2 className="mb-4">Exercises</h2>
            <div className="accordion mb-5" id="exerciseAccordion">
                {Object.entries(groupedExercises).map(([lessonName, lessonExercises], index) => (
                    <div className="accordion-item" key={`ex-${index}`}>
                        <h2 className="accordion-header" id={`exercise-heading-${index}`}>
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#exercise-collapse-${index}`}
                                aria-expanded="false"
                                aria-controls={`exercise-collapse-${index}`}
                            >
                                {lessonName}
                            </button>
                        </h2>
                        <div
                            id={`exercise-collapse-${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`exercise-heading-${index}`}
                            data-bs-parent="#exerciseAccordion"
                        >
                            <div className="accordion-body">
                                <ul className="list-group list-group-flush">
                                    {lessonExercises.map((exercise) => (
                                        <li key={exercise.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">{exercise.name}</h6>
                                                <small>Duration: {exercise.durationMinutes} minutes | Max Score: {exercise.maxScore}</small>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => navigate(`/courses/${courseId}/exercises/${exercise.id}`)}
                                            >
                                                View
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ExercisesSection;
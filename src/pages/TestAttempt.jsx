import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Container,
	Card,
	ProgressBar,
	Form,
	Button,
	Modal,
	Alert,
	Spinner,
	Row,
	Col,
	Badge,
} from "react-bootstrap";
import Apis, { authApis, endpoints } from "../configs/Apis";
import { toast } from "react-toastify";

const TestAttempt = () => {
	const { courseId, testId } = useParams();
	const navigate = useNavigate();

	// State for quiz test
	const [testDetail, setTestDetail] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [attempts, setAttempts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// State for quiz attempt
	const [answers, setAnswers] = useState({});
	const [timeLeft, setTimeLeft] = useState(null);
	const [showSubmitModal, setShowSubmitModal] = useState(false);
	const [alert, setAlert] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				setLoading(true);

				// Fetch test details
				const testResponse = await Apis.get(
					endpoints["testDetail"](courseId, testId)
				);
				setTestDetail(testResponse.data);

				setTimeLeft(testResponse.data.durationMinutes * 60); // Convert minutes to seconds

				// Fetch questions
				const questionsResponse = await Apis.get(
					endpoints["testQuestions"](courseId, testId)
				);
				setQuestions(questionsResponse.data);
			} catch (error) {
				setError("Failed to fetch test details or questions.");
				console.error(error);
				setTimeout(
					() => navigate(`/courses/${courseId}/tests/${testId}`),
					2000
				);
			} finally {
				setLoading(false);
			}
		};
		fetchQuizData();
	}, [courseId, testId, navigate]);

	useEffect(() => {
		if (timeLeft === null) return;

		if (timeLeft <= 0 && !isSubmitting) {
			setAlert({
				type: "danger",
				message: "Time is up! Submitting your attempt.",
			});
			handleSubmit();
		}

		if (!isSubmitting && timeLeft > 0) {
			const timer = setTimeout(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [timeLeft, isSubmitting]);

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	// Calculate progress percentage
	const progressPercentage = testDetail
		? 100 - (timeLeft / (testDetail.durationMinutes * 60)) * 100
		: 0;

	const handleAnswerSelect = (questionId, answerId) => {
		if (!isSubmitting) {
			setAnswers((prev) => ({
				...prev,
				[questionId]: answerId,
			}));
		}
	};

	const handleSubmit = () => {
		const answeredCount = Object.keys(answers).length;
		const totalQuestions = questions.length;
		if (answeredCount < totalQuestions) {
			setAlert({
				variant: "warning",
				message: `You have answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to submit?`,
			});
		} else {
			setAlert(null);
		}
		setShowSubmitModal(true);
	};

	const handleAutoSubmit = async () => {
		setIsSubmitting(true);
		setAlert({
			variant: "danger",
			message: "Time is up! Your quiz has been automatically submitted.",
		});

		await submitAttempt();
	};

	const calculateScore = () => {
		if (questions.length === 0) return 0;

		let correctCount = 0;
		questions.forEach((question) => {
			const selectedAnswerId = answers[question.id];
			if (selectedAnswerId) {
				const selectedAnswer = question.multipleChoiceAnswerSet.find(
					(a) => a.id === selectedAnswerId
				);
				if (selectedAnswer?.isCorrect) {
					correctCount++;
				}
			}
		});

		return (correctCount / questions.length) * 100; // Tính phần trăm
	};

	const prepareAnswerSet = () => {
		return questions.map((question) => {
			const selectedAnswerId = answers[question.id];
			const selectedAnswer = question.multipleChoiceAnswerSet.find(
				(a) => a.id === selectedAnswerId
			);

			return {
				questionIdId: question.id,
				answerText: selectedAnswer?.content || "",
				isCorrect: selectedAnswer?.isCorrect || false,
				score: selectedAnswer?.isCorrect
					? testDetail.maxScore / questions.length
					: 0,
			};
		});
	};

	// Submit the attempt
	const submitAttempt = async () => {
		try {
			setIsSubmitting(true);

			// Chuẩn bị dữ liệu để gửi lên server
			const requestData = {
				startedAt: new Date(), // Thời gian bắt đầu làm bài
				submittedAt: new Date(), // Thời gian nộp bài
				totalScore: calculateScore(), // Tính điểm dựa trên câu trả lời đúng
				testIdId: testId, // ID test
				testAttemptAnswerSet: prepareAnswerSet(), // Chuẩn bị tập hợp câu trả lời
			};

			const response = await authApis().post(
				endpoints["testSubmit"](courseId, testId),
				requestData
			);

			toast.success("Quiz submitted successfully!");

			setIsSubmitted(true);

			// // Redirect sau 3 giây
			// setTimeout(() => {
			//     navigate(`/courses/${courseId}/tests/${testId}`);
			// }, 3000);

			return response.data;
		} catch (err) {
			toast.error("Failed to submit quiz. Please try again.");
			console.error("Error submitting quiz:", err);
			return null;
		} finally {
			setIsSubmitting(false);
		}
	};

	// Confirm submission
	const confirmSubmit = async () => {
		setShowSubmitModal(false);
		setIsSubmitting(true);
		await submitAttempt();
	};

	if (loading) {
		return (
			<Container className="text-center my-5">
				<Spinner animation="border" variant="primary" />
				<p className="mt-2">Loading quiz...</p>
			</Container>
		);
	}

	if (error) {
		return (
			<Container className="my-5">
				<Alert variant="danger">{error}</Alert>
			</Container>
		);
	}

	if (!testDetail || questions.length === 0) {
		return (
			<Container className="my-5">
				<Alert variant="warning">No quiz data available</Alert>
				<Button
					variant="secondary"
					onClick={() => navigate(`/courses/${courseId}/tests/${testId}`)}
				>
					Go Back
				</Button>
			</Container>
		);
	}

	return (
		<Container className="quiz-attempt-container my-4">
			{/* Quiz Header */}
			<Card className="mb-4">
				<Card.Header className="d-flex justify-content-between align-items-center">
					<div>
						<h4 className="mb-0">{testDetail.name}</h4>
						<small className="text-muted">{testDetail.lessonIdName}</small>
					</div>
					<div
						className={`time-display ${
							timeLeft < 60 ? "text-danger" : "text-primary"
						}`}
					>
						<i className="bi bi-clock me-2"></i>
						<strong>{formatTime(timeLeft)}</strong>
					</div>
				</Card.Header>

				<Card.Body>
					{/* Progress Bar */}
					<ProgressBar
						now={progressPercentage}
						variant={timeLeft < 60 ? "danger" : "primary"}
						className="mb-4"
						label={`${Math.round(progressPercentage)}%`}
					/>

					{/* Alert Messages */}
					{alert && (
						<Alert
							variant={alert.variant}
							onClose={() => setAlert(null)}
							dismissible
							className="mt-3"
						>
							{alert.message}
						</Alert>
					)}

					{/* Quiz Info */}
					<Row className="mb-4">
						<Col md={4}>
							<Card>
								<Card.Body>
									<Card.Title>Quiz Info</Card.Title>
									<ul className="list-unstyled">
										<li>
											<strong>Questions:</strong> {questions.length}
										</li>
										<li>
											<strong>Duration:</strong> {testDetail.durationMinutes}{" "}
											mins
										</li>
										<li>
											<strong>Max Score:</strong> {testDetail.maxScore}
										</li>
									</ul>
								</Card.Body>
							</Card>
						</Col>
						<Col md={8}>
							<Card>
								<Card.Body>
									<Card.Title>Instructions</Card.Title>
									<ul>
										<li>Read each question carefully before answering.</li>
										<li>You can only select one answer per question.</li>
										<li>The quiz will auto-submit when time expires.</li>
										<li>Once submitted, you cannot change your answers.</li>
									</ul>
								</Card.Body>
							</Card>
						</Col>
					</Row>

					{/* Questions List */}
					<Form>
						{questions.map((question, index) => (
							<Card key={question.id} className="mb-4 question-card">
								<Card.Header className="d-flex justify-content-between align-items-center">
									<h5 className="mb-0">Question {index + 1}</h5>
									{answers[question.id] && !isSubmitting && (
										<Badge bg="info">Answered</Badge>
									)}
								</Card.Header>
								<Card.Body>
									<Card.Text className="question-text mb-3">
										{question.content}
									</Card.Text>

									{question.multipleChoiceAnswerSet.map((answer) => (
										<Form.Check
											key={answer.id}
											type="radio"
											id={`q${question.id}-a${answer.id}`}
											name={`question-${question.id}`}
											label={answer.content}
											checked={answers[question.id] === answer.id}
											onChange={() =>
												handleAnswerSelect(question.id, answer.id)
											}
											disabled={isSubmitting}
											className="mb-2 answer-option"
										/>
									))}

									{/* Show correct/incorrect feedback after submission */}
									{isSubmitted && answers[question.id] && (
										<Alert
											variant={
												question.multipleChoiceAnswerSet.find(
													(a) => a.id === answers[question.id]
												)?.isCorrect
													? "success"
													: "danger"
											}
											className="mt-3 feedback-alert"
										>
											{question.multipleChoiceAnswerSet.find(
												(a) => a.id === answers[question.id]
											)?.isCorrect
												? "✓ Correct Answer!"
												: "✗ Incorrect Answer"}
										</Alert>
									)}
								</Card.Body>
							</Card>
						))}

						{/* Submit Button */}
						{isSubmitted ? (
							<div className="text-center mt-4">
								<Button
									variant="primary"
									size="lg"
									onClick={() => navigate(`/course/${courseId}/learning`)}
								>
									Back To Learning
								</Button>
							</div>
						) : (
							<div className="text-center mt-4">
								<Button
									variant="primary"
									size="lg"
									onClick={handleSubmit}
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Spinner as="span" animation="border" size="sm" />{" "}
											Submitting...
										</>
									) : (
										"Submit Quiz"
									)}
								</Button>
							</div>
						)}
					</Form>
				</Card.Body>
			</Card>

			{/* Submit Confirmation Modal */}
			<Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Submission</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{alert ? (
						<Alert variant={alert.variant}>{alert.message}</Alert>
					) : (
						<p>Are you sure you want to submit your quiz now?</p>
					)}
					<p>You won't be able to change your answers after submission.</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
						Cancel
					</Button>
					<Button variant="primary" onClick={confirmSubmit}>
						Confirm Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};
export default TestAttempt;

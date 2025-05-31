import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Table, Button, Spinner } from "react-bootstrap";
import Apis, { authApis, endpoints } from "../configs/Apis";
import { useNavigate } from "react-router-dom";

const ExerciseDetails = () => {
    const { courseId, exerciseId } = useParams();
    const [exerciseDetail, setExerciseDetail] = useState(null);
    const [exerciseAttempts, setExerciseAttempts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const pageSize = 5;
    const navigate = useNavigate();

    const fetchExerciseDetail = async () => {
        try {
            const response = await Apis.get(endpoints["exerciseDetail"](courseId, exerciseId));
            if (response.status === 200) {
                setExerciseDetail(response.data);
            } else {
                toast.error("Could not fetch exercise details");
            }
        } catch (error) {
            toast.error("Error fetching exercise details");
            console.error(error);
        }
    };

    const fetchExerciseAttempts = async () => {
        try {
            setLoading(true);
            let url = `${endpoints["exerciseAttempt"](courseId, exerciseId)}?page=${page}`;
            const res = await authApis().get(url);
            if (res.data.length === 0) {
                setPage(0);
            }

            else {
                if (page === 1) {
                    setExerciseAttempts(res.data);
                }
                else {
                    setExerciseAttempts((prev) => [...prev, ...res.data]);
                }
            }
        } catch (error) {
            toast.error("Error fetching exercise attempts");
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchExerciseDetail()]);
            await fetchExerciseAttempts();
            setLoading(false);
        };
        fetchData();
    }, []);

    const loadMore = () => {
        if (!loading && page > 0) {
            setPage(page + 1);
        }
    };

    useEffect(() => {
        if (page > 1) {
            fetchExerciseAttempts();
        }
    }, [page]);


    const formatDate = (arr) => {
        if (!Array.isArray(arr)) return "";
    
        const [y, m, d, h, min] = arr;
        
        // Tạo date ở múi giờ UTC
        const date = new Date(Date.UTC(y, m - 1, d, h, min));
        
        // Điều chỉnh sang UTC+7
        date.setHours(date.getHours() + 7);
        
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    return (
        <>
            {loading && (
                <div className="text-center my-3">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}
            <div className="exercise-details container mt-4">
                {exerciseDetail && (
                    <>
                        <h2>{exerciseDetail.name}</h2>
                        <p><strong>Lesson:</strong> {exerciseDetail.lessonIdName}</p>
                        <p><strong>Duration:</strong> {exerciseDetail.durationMinutes} minutes</p>
                        <p><strong>Max Score:</strong> {exerciseDetail.maxScore}</p>

                        {exerciseAttempts.length === 0 ? (
                            <Button variant="primary"
                                    onClick={() => navigate(`/courses/${courseId}/exercises/${exerciseId}/attempt`)}>Take Quiz</Button>
                        ) : (
                            <Button variant="warning"
                                    onClick={() => navigate(`/courses/${courseId}/exercises/${exerciseId}/attempt`)}>Retry</Button>
                        )}

                        <hr />
                        <h4>Previous Attempts</h4>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Started At</th>
                                    <th>Submitted At</th>
                                    <th>Score</th>
                                    <th>Response</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exerciseAttempts.map((attempt, index) => (
                                    <tr key={attempt.id}>
                                        <td>{index + 1}</td>
                                        <td>{formatDate(attempt.startedAt)}</td>
                                        <td>{formatDate(attempt.submittedAt)}</td>
                                        <td>{attempt.totalScore}%</td>
                                        <td>{attempt.response}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {exerciseAttempts.length > 0 && (
                            <div className="text-center mb-3">
                                <Button onClick={loadMore}>Load More</Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default ExerciseDetails;

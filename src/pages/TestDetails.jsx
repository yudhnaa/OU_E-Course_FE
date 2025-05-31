import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Table, Button, Spinner } from "react-bootstrap";
import Apis, { authApis, endpoints } from "../configs/Apis";
import { useNavigate } from "react-router-dom";

const TestDetails = () => {
    const { courseId, testId } = useParams();
    const [testDetail, setTestDetail] = useState(null);
    const [testAttempts, setTestAttempts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchTestDetail = async () => {
        try {
            const response = await Apis.get(endpoints["testDetail"](courseId, testId));
            if (response.status === 200) {
                setTestDetail(response.data);
            } else {
                toast.error("Could not fetch test details");
            }
        } catch (error) {
            toast.error("Error fetching test details");
            console.error(error);
        }
    };

    const fetchTestAttempts = async () => {
        try {
            setLoading(true);
            let url = `${endpoints["testAttempt"](courseId, testId)}?page=${page}`;
            const res = await authApis().get(url);
            if (res.data.length === 0) {
                setPage(0);
            } else {
                if (page === 1) {
                    setTestAttempts(res.data);
                } else {
                    setTestAttempts((prev) => [...prev, ...res.data]);
                }
            }
        } catch (error) {
            toast.error("Error fetching test attempts");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchTestDetail();
            await fetchTestAttempts();
        };
        fetchData();
    }, [courseId, testId]);

    const loadMore = () => {
        if (!loading && page > 0) {
            setPage(page + 1);
        }
    };

    useEffect(() => {
        if (page > 1) {
            fetchTestAttempts();
        }
    }, [page]);

    const formatDate = (arr) => {
        if (!Array.isArray(arr)) return "";
        const [y, m, d, h, min] = arr;
        return `${d}/${m}/${y} ${h}:${min.toString().padStart(2, "0")}`;
    };

    return (
        <>
            {loading && (
                    <div className="text-center my-3">
                        <Spinner animation="border" variant="primary" />
                    </div>
            )}

            <div className="test-details container mt-4">
                {testDetail && (
                    <>
                        <h2>{testDetail.name}</h2>
                        <p><strong>Duration:</strong> {testDetail.durationMinutes} minutes</p>
                        <p><strong>Max Score:</strong> {testDetail.maxScore}</p>
                        <p><strong>Description:</strong> {testDetail.description}</p>

                        {testAttempts.length === 0 ? (
                            <Button variant="primary"
                                    onClick={() => navigate(`/courses/${courseId}/tests/${testId}/attempt`)}>Take Quiz</Button>
                        ) : (
                            <Button variant="warning"
                                    onClick={() => navigate(`/courses/${courseId}/tests/${testId}/attempt`)}>Retry</Button>
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
                                </tr>
                            </thead>
                            <tbody>
                                {testAttempts.map((attempt, index) => (
                                    <tr key={attempt.id}>
                                        <td>{index + 1}</td>
                                        <td>{formatDate(attempt.startedAt)}</td>
                                        <td>{formatDate(attempt.submittedAt)}</td>
                                        <td>{attempt.totalScore}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {testAttempts.length > 0 && (
                            <div className="text-center mb-3">
                                <Button onClick={loadMore}>Load More</Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default TestDetails;
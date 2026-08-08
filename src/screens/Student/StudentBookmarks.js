import { useEffect, useState } from "react";
import {Card, Button, Spinner, Badge, Row, Col} from "react-bootstrap";
import { Link } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const StudentBookmarks = () => {

    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadBookmarks = async () => {

        try {

            const res = await authApis().get(
                endpoints.bookmarks
            );

            setJobs(res.data.data);

        } catch (err) {

            console.error(err);

            toast.error("Không tải được danh sách yêu thích");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadBookmarks();

    }, []);

    const removeBookmark = async (jobId) => {

        if (!window.confirm("Bỏ lưu việc làm này?"))
            return;

        try {

            await authApis().delete(
                endpoints.unBookmark(jobId)
            );

            setJobs(current =>
                current.filter(j => j.id !== jobId)
            );

            toast.success("Đã bỏ lưu việc làm");

        } catch (err) {

            console.error(err);

            toast.error("Có lỗi xảy ra");
        }
    };

    if (loading)
        return <Spinner className="mt-5" />;

    return (

        <>

            <h2 className="mb-4">

                Việc làm đã lưu

            </h2>

            {
                jobs.length === 0 && (

                    <Card>

                        <Card.Body>

                            Chưa có việc làm nào được lưu.

                        </Card.Body>

                    </Card>

                )
            }

            <Row>

                {

                    jobs.map(job => (

                        <Col
                            md={6}
                            className="mb-3"
                            key={job.id}
                        >

                            <Card>

                                <Card.Body>

                                    <h5>

                                        {job.title}

                                    </h5>

                                    <p>

                                        <b>Doanh nghiệp:</b>

                                        {" "}

                                        {job.company?.name}

                                    </p>

                                    <p>

                                        <b>Địa điểm:</b>

                                        {" "}

                                        {job.location}

                                    </p>

                                    <p>

                                        <b>Lương:</b>

                                        {" "}

                                        {Number(job.salary_min).toLocaleString()}

                                        {" - "}

                                        {Number(job.salary_max).toLocaleString()}

                                    </p>

                                    <p>

                                        <b>Hạn nộp:</b>

                                        {" "}

                                        {dayjs(job.deadline).format("DD/MM/YYYY")}

                                    </p>

                                    <div className="mb-3">

                                        {
                                            job.skills?.map(skill => (

                                                <Badge
                                                    bg="primary"
                                                    className="me-2"
                                                    key={skill.id}
                                                >

                                                    {skill.name}

                                                </Badge>

                                            ))
                                        }

                                    </div>

                                    <div
                                        className="d-flex gap-2"
                                    >

                                        <Link
                                            to={`/jobs/${job.id}`}
                                        >

                                            <Button>

                                                Xem chi tiết

                                            </Button>

                                        </Link>

                                        <Button
                                            variant="outline-danger"
                                            onClick={() =>
                                                removeBookmark(job.id)
                                            }
                                        >

                                            Xóa

                                        </Button>

                                    </div>

                                </Card.Body>

                            </Card>

                        </Col>

                    ))

                }

            </Row>

        </>

    );
};

export default StudentBookmarks;
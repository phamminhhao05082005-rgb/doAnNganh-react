import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";
import {
    Button,
    Card,
    Spinner,
    Table
} from "react-bootstrap";
import { Link } from "react-router-dom";

const EmployerJobs = () => {

    const [jobs, setJobs] = useState(null);

    const loadJobs = async () => {

        const res = await authApis().get(
            endpoints.myJobs
        );

        setJobs(res.data.data);
    }

    const deleteJob = async (id) => {

        if (!window.confirm("Bạn có chắc muốn xóa?"))
            return;

        await authApis().delete(
            endpoints.deleteJob(id)
        );

        loadJobs();
    }

    useEffect(() => {

        loadJobs();

    }, []);

    if (jobs === null)
        return <Spinner className="mt-5" />;

    return (

        <Card className="mt-4">

            <Card.Header
                className="d-flex justify-content-between align-items-center"
            >

                <h3>

                    Quản lý tin tuyển dụng

                </h3>

                <Link
                    to="/employer/jobs/create"
                >

                    <Button>

                        + Đăng tin

                    </Button>

                </Link>

            </Card.Header>

            <Card.Body>

                <Table
                    striped
                    bordered
                    hover
                >

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Tiêu đề</th>

                            <th>Địa điểm</th>

                            <th>Lương theo giờ</th>

                            <th>Hạn</th>

                            <th>Trạng thái</th>

                            <th width="230">

                                Thao tác

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {jobs.length === 0 ?

                            <tr>

                                <td
                                    colSpan={7}
                                    className="text-center"
                                >

                                    Chưa có tin tuyển dụng

                                </td>

                            </tr>

                            :

                            jobs.map(job => (

                                <tr key={job.id}>

                                    <td>

                                        {job.id}

                                    </td>

                                    <td>

                                        {job.title}

                                    </td>

                                    <td>

                                        {job.location}

                                    </td>

                                    <td>

                                        {job.salary_min.toLocaleString()}đ
                                        {" - "}
                                        {job.salary_max.toLocaleString()}đ

                                    </td>

                                    <td>

                                        {dayjs(job.deadline).format("DD/MM/YYYY")}

                                    </td>

                                    <td>

                                        {

                                            job.status ?

                                                <span
                                                    className="badge bg-success"
                                                >

                                                    Đang tuyển

                                                </span>

                                                :

                                                <span
                                                    className="badge bg-danger"
                                                >

                                                    Đã đóng

                                                </span>

                                        }

                                    </td>

                                    <td>

                                        <Link
                                            to={`/jobs/${job.id}`}
                                        >

                                            <Button
                                                size="sm"
                                                variant="info"
                                            >

                                                Xem

                                            </Button>

                                        </Link>

                                        {" "}

                                        <Link
                                            to={`/employer/jobs/${job.id}/edit`}
                                        >

                                            <Button
                                                size="sm"
                                                variant="warning"
                                            >

                                                Sửa

                                            </Button>

                                        </Link>

                                        {" "}

                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() =>
                                                deleteJob(job.id)
                                            }
                                        >

                                            Xóa

                                        </Button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </Table>

            </Card.Body>

        </Card>

    );

}

export default EmployerJobs;
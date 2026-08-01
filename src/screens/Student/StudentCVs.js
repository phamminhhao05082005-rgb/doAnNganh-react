import { useEffect, useState } from "react";
import {
    Card,
    Button,
    Spinner,
    Table,
    Badge
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const StudentCVs = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [cvs, setCVs] = useState([]);
    const loadCVs = async () => {

        try {

            const res = await authApis().get(
                endpoints.cvs
            );

            setCVs(res.data.data || []);

        } catch (err) {

            console.error(err);

            alert("Không thể tải danh sách CV");

        } finally {

            setLoading(false);

        }

    };

    const createCV = async (templateId) => {

        try {

            const res = await authApis().post(

                endpoints.cvs,

                {
                    template_id: templateId
                }

            );

            const cv = res.data.data;

            navigate(`/student/cvs/${cv.id}/edit`);

        } catch (err) {

            console.error(err);

            alert("Không thể tạo CV");

        }

    };

    useEffect(() => {

        loadCVs();

    }, []);

    const removeCV = async (id) => {

        if (!window.confirm("Bạn có chắc muốn xóa CV này?"))

            return;

        try {

            await authApis().delete(

                endpoints.cv(id)

            );

            loadCVs();

        } catch (err) {

            console.error(err);

            alert("Xóa thất bại");

        }

    };

    if (loading)

        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );

    return (

        <Card className="shadow mt-4">

            <Card.Header
                className="d-flex justify-content-between align-items-center"
            >

                <h3 className="mb-0">
                    Quản lý CV
                </h3>

                <Button
                    as={Link}
                    to="/student/cvs"
                >
                    + Tạo CV mới
                </Button>

            </Card.Header>

            <Card.Body>

                {
                    cvs.length === 0 &&

                    <div className="text-center py-5">

                        <h5>
                            Bạn chưa có CV nào
                        </h5>

                    </div>
                }

                {
                    cvs.length > 0 &&

                    <Table
                        bordered
                        hover
                        responsive
                    >

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Tiêu đề</th>

                                <th>Mẫu CV</th>

                                <th>Ngày tạo</th>

                                <th>Trạng thái</th>

                                <th width="260">
                                    Thao tác
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                cvs.map((cv, index) => (

                                    <tr key={cv.id}>

                                        <td>

                                            {index + 1}

                                        </td>

                                        <td>

                                            <b>

                                                {cv.title}

                                            </b>

                                        </td>

                                        <td>

                                            {cv.template?.name}

                                        </td>

                                        <td>

                                            {
                                                dayjs(
                                                    cv.created_at
                                                ).format(
                                                    "DD/MM/YYYY"
                                                )
                                            }

                                        </td>

                                        <td>

                                            {
                                                cv.status ?

                                                    <Badge bg="success">

                                                        Hoạt động

                                                    </Badge>

                                                    :

                                                    <Badge bg="secondary">

                                                        Ẩn

                                                    </Badge>
                                            }

                                        </td>

                                        <td>

                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => removeCV(cv.id)}
                                            >
                                                Xóa
                                            </Button>

                                            <Button
                                                as={Link}
                                                to={`/student/cvs/${cv.id}`}
                                                size="sm"
                                                variant="primary"
                                            >
                                                Xem / Sửa CV
                                            </Button>

                                        </td>

                                    </tr>

                                ))
                            }

                        </tbody>

                    </Table>

                }

            </Card.Body>

        </Card>

    );

};

export default StudentCVs;
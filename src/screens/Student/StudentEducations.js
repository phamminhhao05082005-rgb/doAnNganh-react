import { useEffect, useState } from "react";
import {
    Card,
    Button,
    Table,
    Modal,
    Form,
    Spinner
} from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";

const StudentEducations = () => {

    const [educations, setEducations] = useState([]);

    const [loading, setLoading] = useState(true);

    const [show, setShow] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        school: "",
        major: "",
        start_year: "",
        end_year: ""
    });

    const loadEducations = async () => {

        try {

            const res = await authApis().get(
                endpoints.educations
            );

            setEducations(res.data.data || []);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadEducations();

    }, []);

    const openCreate = () => {

        setEditingId(null);

        setForm({
            school: "",
            major: "",
            start_year: "",
            end_year: ""
        });

        setShow(true);

    };

    const openEdit = (e) => {

        setEditingId(e.id);

        setForm({

            school: e.school,

            major: e.major,

            start_year: e.start_year,

            end_year: e.end_year || ""

        });

        setShow(true);

    };

    const save = async () => {

        try {

            if (editingId) {

                await authApis().put(

                    endpoints.education(editingId),

                    form

                );

            } else {

                await authApis().post(

                    endpoints.educations,

                    form

                );

            }

            setShow(false);

            loadEducations();

        } catch (err) {

            console.error(err);

            alert("Có lỗi xảy ra");

        }

    };

    const remove = async (id) => {

        if (!window.confirm("Xóa học vấn này?"))

            return;

        try {

            await authApis().delete(

                endpoints.education(id)

            );

            loadEducations();

        } catch (err) {

            console.error(err);

        }

    };

    if (loading)

        return <Spinner className="mt-5" />;

    return (

        <Card className="mt-4 shadow">

            <Card.Header className="d-flex justify-content-between">

                <h3>

                    Quản lý học vấn

                </h3>

                <Button onClick={openCreate}>

                    Thêm học vấn

                </Button>

            </Card.Header>

            <Card.Body>

                <Table hover bordered>

                    <thead>

                        <tr>

                            <th>Trường</th>

                            <th>Chuyên ngành</th>

                            <th>Bắt đầu</th>

                            <th>Kết thúc</th>

                            <th width="170">

                                Thao tác

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            educations.map(e => (

                                <tr key={e.id}>

                                    <td>

                                        {e.school}

                                    </td>

                                    <td>

                                        {e.major}

                                    </td>

                                    <td>

                                        {e.start_year}

                                    </td>

                                    <td>

                                        {

                                            e.end_year ||

                                            "Đang học"

                                        }

                                    </td>

                                    <td>

                                        <Button

                                            size="sm"

                                            variant="warning"

                                            className="me-2"

                                            onClick={() => openEdit(e)}

                                        >

                                            Sửa

                                        </Button>

                                        <Button

                                            size="sm"

                                            variant="danger"

                                            onClick={() => remove(e.id)}

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

            <Modal

                show={show}

                onHide={() => setShow(false)}

            >

                <Modal.Header closeButton>

                    <Modal.Title>

                        {

                            editingId

                                ? "Cập nhật học vấn"

                                : "Thêm học vấn"

                        }

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Trường

                        </Form.Label>

                        <Form.Control

                            value={form.school}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    school: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Chuyên ngành

                        </Form.Label>

                        <Form.Control

                            value={form.major}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    major: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Năm bắt đầu

                        </Form.Label>

                        <Form.Control

                            type="number"

                            value={form.start_year}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    start_year: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group>

                        <Form.Label>

                            Năm kết thúc

                        </Form.Label>

                        <Form.Control

                            type="number"

                            value={form.end_year}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    end_year: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>

                    <Button

                        variant="secondary"

                        onClick={() => setShow(false)}

                    >

                        Hủy

                    </Button>

                    <Button onClick={save}>

                        Lưu

                    </Button>

                </Modal.Footer>

            </Modal>

        </Card>

    );

};

export default StudentEducations;
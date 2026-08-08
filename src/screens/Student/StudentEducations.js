import { useEffect, useState } from "react";
import {Card, Button, Table, Modal, Form, Spinner} from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";

const StudentEducations = () => {

    const [educations, setEducations] = useState([]);

    const [loading, setLoading] = useState(true);

    const [show, setShow] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        school_name: "",
        major: "",
        degree: "",
        gpa: "",
        start_date: "",
        end_date: ""
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
            school_name: "",
            major: "",
            degree: "",
            gpa: "",
            start_date: "",
            end_date: ""
        });

        setShow(true);

    };

    const openEdit = (e) => {

        setEditingId(e.id);

        setForm({

            school_name: e.school_name,

            major: e.major,

            degree: e.degree || "",

            gpa: e.gpa || "",

            start_date: e.start_date,

            end_date: e.end_date || ""

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

                            <th>Bằng cấp</th>

                            <th>GPA</th>

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

                                        {e.school_name}

                                    </td>

                                    <td>

                                        {e.major}

                                    </td>

                                    <td>

                                        {e.degree || "-"}

                                    </td>

                                    <td>

                                        {e.gpa || "-"}

                                    </td>

                                    <td>

                                        {dayjs(e.start_date).format("DD/MM/YYYY")}

                                    </td>

                                    <td>

                                        {

                                            e.end_date
                                                ? dayjs(e.end_date).format("DD/MM/YYYY")
                                                : "Đang học"

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

                            value={form.school_name}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    school_name: e.target.value

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

                            Bằng cấp

                        </Form.Label>

                        <Form.Control

                            value={form.degree}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    degree: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            GPA

                        </Form.Label>

                        <Form.Control

                            type="number"

                            step="0.01"

                            value={form.gpa}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    gpa: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Ngày bắt đầu

                        </Form.Label>

                        <Form.Control

                            type="date"

                            value={form.start_date}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    start_date: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group>

                        <Form.Label>

                            Ngày kết thúc

                        </Form.Label>

                        <Form.Control

                            type="date"

                            value={form.end_date}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    end_date: e.target.value

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
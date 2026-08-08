import { useEffect, useState } from "react";
import {Card, Button, Table, Modal, Form, Spinner} from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";

const StudentExperiences = () => {

    const [experiences, setExperiences] = useState([]);

    const [loading, setLoading] = useState(true);

    const [show, setShow] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        company_name: "",
        position: "",
        start_date: "",
        end_date: "",
        description: ""
    });

    const loadExperiences = async () => {

        try {

            const res = await authApis().get(
                endpoints.experiences
            );

            setExperiences(res.data.data || []);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadExperiences();

    }, []);

    const openCreate = () => {

        setEditingId(null);

        setForm({
            company_name: "",
            position: "",
            start_date: "",
            end_date: "",
            description: ""
        });

        setShow(true);

    };

    const openEdit = (e) => {

        setEditingId(e.id);

        setForm({

            company_name: e.company_name,

            position: e.position,

            start_date: e.start_date,

            end_date: e.end_date || "",

            description: e.description || ""

        });

        setShow(true);

    };

    const save = async () => {

        try {

            if (editingId) {

                await authApis().put(

                    endpoints.experience(editingId),

                    form

                );

            } else {

                await authApis().post(

                    endpoints.experiences,

                    form

                );

            }

            setShow(false);

            loadExperiences();

        } catch (err) {

            console.error(err);

            alert("Có lỗi xảy ra");

        }

    };

    const remove = async (id) => {

        if (!window.confirm("Xóa kinh nghiệm này?"))

            return;

        try {

            await authApis().delete(

                endpoints.experience(id)

            );

            loadExperiences();

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

                    Quản lý kinh nghiệm

                </h3>

                <Button onClick={openCreate}>

                    Thêm kinh nghiệm

                </Button>

            </Card.Header>

            <Card.Body>

                <Table bordered hover>

                    <thead>

                        <tr>

                            <th>Công ty</th>

                            <th>Vị trí</th>

                            <th>Bắt đầu</th>

                            <th>Kết thúc</th>

                            <th>Mô tả</th>

                            <th width="170">

                                Thao tác

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            experiences.map(e => (

                                <tr key={e.id}>

                                    <td>

                                        {e.company_name}

                                    </td>

                                    <td>

                                        {e.position}

                                    </td>

                                    <td>

                                        {dayjs(e.start_date).format("DD/MM/YYYY")}

                                    </td>

                                    <td>

                                        {

                                            e.end_date
                                                ? dayjs(e.end_date).format("DD/MM/YYYY")
                                                : "Hiện tại"

                                        }

                                    </td>

                                    <td>

                                        {e.description}

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

                size="lg"
            >

                <Modal.Header closeButton>

                    <Modal.Title>

                        {

                            editingId

                                ? "Cập nhật kinh nghiệm"

                                : "Thêm kinh nghiệm"

                        }

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Công ty

                        </Form.Label>

                        <Form.Control

                            value={form.company_name}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    company_name: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Vị trí

                        </Form.Label>

                        <Form.Control

                            value={form.position}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    position: e.target.value

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

                            value={form.start_date || ""}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    start_date: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

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

                    <Form.Group>

                        <Form.Label>

                            Mô tả

                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={4}

                            value={form.description}

                            onChange={e =>

                                setForm({

                                    ...form,

                                    description: e.target.value

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

export default StudentExperiences;
import {
    Card,
    Row,
    Col,
    Image,
    Badge,
    Form,
    Button
} from "react-bootstrap";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const CVTemplate1 = ({ cv, onSave }) => {

    const [form, setForm] = useState({});

    useEffect(() => {
        setForm(cv);
    }, [cv]);

    const change = (field, value) => {
        setForm({
            ...form,
            [field]: value
        });
    };

    const save = () => {
        onSave(form);
    };

    return (

        <Card
            className="shadow-lg border-0 mt-4 mb-5"
            style={{ minHeight: "100vh" }}
        >

            <Row className="g-0">

                <Col
                    md={4}
                    className="bg-dark text-white p-4"
                >

                    <div className="text-center">

                        <Image
                            src={
                                form.avatar ||
                                "https://via.placeholder.com/180"
                            }
                            roundedCircle
                            fluid
                            style={{
                                width: 180,
                                height: 180,
                                objectFit: "cover",
                                border: "5px solid white"
                            }}
                        />

                        <Form.Group className="mt-3">

                            <Form.Control
                                value={form.full_name || ""}
                                onChange={(e) =>
                                    change("full_name", e.target.value)
                                }
                            />

                        </Form.Group>

                        <Form.Group className="mt-2">

                            <Form.Control
                                value={form.job_title || ""}
                                onChange={(e) =>
                                    change("job_title", e.target.value)
                                }
                            />

                        </Form.Group>

                    </div>

                    <hr />

                    <h5>Thông tin liên hệ</h5>

                    <Form.Group className="mb-2">

                        <Form.Label>Email</Form.Label>

                        <Form.Control
                            value={form.email || ""}
                            onChange={(e) =>
                                change("email", e.target.value)
                            }
                        />

                    </Form.Group>

                    <Form.Group className="mb-2">

                        <Form.Label>Số điện thoại</Form.Label>

                        <Form.Control
                            value={form.phone || ""}
                            onChange={(e) =>
                                change("phone", e.target.value)
                            }
                        />

                    </Form.Group>

                    <Form.Group className="mb-2">

                        <Form.Label>Avatar</Form.Label>

                        <Form.Control
                            value={form.avatar || ""}
                            onChange={(e) =>
                                change("avatar", e.target.value)
                            }
                        />

                    </Form.Group>

                    <hr />

                    <Form.Group className="mb-2">

                        <Form.Label>Mức lương mong muốn</Form.Label>

                        <Form.Control
                            type="number"
                            value={form.expected_salary || 0}
                            onChange={(e) =>
                                change(
                                    "expected_salary",
                                    e.target.value
                                )
                            }
                        />

                    </Form.Group>

                    <Form.Group>

                        <Form.Label>Kinh nghiệm (năm)</Form.Label>

                        <Form.Control
                            type="number"
                            value={form.experience_year || 0}
                            onChange={(e) =>
                                change(
                                    "experience_year",
                                    e.target.value
                                )
                            }
                        />

                    </Form.Group>

                </Col>

                <Col
                    md={8}
                    className="p-5"
                >

                    <h3>Tiêu đề CV</h3>

                    <Form.Control
                        className="mb-4"
                        value={form.title || ""}
                        onChange={(e) =>
                            change("title", e.target.value)
                        }
                    />

                    <h3>GIỚI THIỆU</h3>

                    <Form.Control
                        as="textarea"
                        rows={6}
                        value={form.summary || ""}
                        onChange={(e) =>
                            change("summary", e.target.value)
                        }
                    />

                    <div className="text-end mt-4">

                        <Button
                            variant="success"
                            onClick={save}
                        >
                            Lưu CV
                        </Button>

                    </div>

                    <hr />

                    <p
                        style={{
                            whiteSpace: "pre-line"
                        }}
                    >

                        {

                            cv.summary ||

                            "Chưa cập nhật"

                        }

                    </p>

                    <br />

                    <h3>

                        HỌC VẤN

                    </h3>

                    <hr />

                    {

                        cv.educations &&
                            cv.educations.length > 0 ?

                            (

                                cv.educations.map(edu => (

                                    <Card
                                        key={edu.id}
                                        className="mb-3 border-0 shadow-sm"
                                    >

                                        <Card.Body>

                                            <h5 className="fw-bold">

                                                {

                                                    edu.school_name

                                                }

                                            </h5>

                                            <div className="text-primary">

                                                {

                                                    edu.major

                                                }

                                            </div>

                                            {

                                                edu.degree &&

                                                <div>

                                                    {

                                                        edu.degree

                                                    }

                                                </div>

                                            }

                                            {

                                                edu.gpa &&

                                                <div>

                                                    GPA: {edu.gpa}

                                                </div>

                                            }

                                            <small className="text-muted">

                                                {

                                                    dayjs(
                                                        edu.start_date
                                                    ).format(
                                                        "MM/YYYY"
                                                    )

                                                }

                                                {" - "}

                                                {

                                                    edu.end_date ?

                                                        dayjs(
                                                            edu.end_date
                                                        ).format(
                                                            "MM/YYYY"
                                                        )

                                                        :

                                                        "Hiện tại"

                                                }

                                            </small>

                                        </Card.Body>

                                    </Card>

                                ))

                            )

                            :

                            (

                                <p className="text-muted">

                                    Chưa có học vấn.

                                </p>

                            )

                    }

                    <br />

                    <h3>

                        KINH NGHIỆM LÀM VIỆC

                    </h3>

                    <hr />

                    {

                        cv.experiences &&
                            cv.experiences.length > 0 ?

                            (

                                cv.experiences.map(exp => (

                                    <Card
                                        key={exp.id}
                                        className="mb-3 border-0 shadow-sm"
                                    >

                                        <Card.Body>

                                            <h5>

                                                {

                                                    exp.company_name

                                                }

                                            </h5>

                                            <div
                                                className="fw-bold text-primary"
                                            >

                                                {

                                                    exp.position

                                                }

                                            </div>

                                            <small className="text-muted">

                                                {

                                                    dayjs(
                                                        exp.start_date
                                                    ).format(
                                                        "MM/YYYY"
                                                    )

                                                }

                                                {" - "}

                                                {

                                                    exp.end_date ?

                                                        dayjs(
                                                            exp.end_date
                                                        ).format(
                                                            "MM/YYYY"
                                                        )

                                                        :

                                                        "Hiện tại"

                                                }

                                            </small>

                                            <p
                                                className="mt-2"
                                                style={{
                                                    whiteSpace:
                                                        "pre-line"
                                                }}
                                            >

                                                {

                                                    exp.description

                                                }

                                            </p>

                                        </Card.Body>

                                    </Card>

                                ))

                            )

                            :

                            (

                                <p className="text-muted">

                                    Chưa có kinh nghiệm.

                                </p>

                            )

                    }

                </Col>

            </Row>

        </Card>

    );

};

export default CVTemplate1;
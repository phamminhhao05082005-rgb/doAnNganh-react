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

    const [educations, setEducations] = useState([]);

    const [experiences, setExperiences] = useState([]);

    const [deletedEducationIds, setDeletedEducationIds] = useState([]);

    const [deletedExperienceIds, setDeletedExperienceIds] = useState([]);

    useEffect(() => {

        setForm(cv || {});

        setEducations(
            cv?.educations
                ? [...cv.educations]
                : []
        );

        setExperiences(
            cv?.experiences
                ? [...cv.experiences]
                : []
        );

    }, [cv]);

    const change = (field, value) => {

        setForm(prev => ({
            ...prev,
            [field]: value
        }));

    };

   const save = () => {

    onSave({

        ...form,

        educations,

        experiences,

        deletedEducationIds,

        deletedExperienceIds

    });

};


    const changeEducation = (index, field, value) => {

        setEducations(prev => {

            const list = [...prev];

            list[index] = {
                ...list[index],
                [field]: value
            };

            return list;

        });

    };

    const addEducation = () => {

        setEducations(prev => [

            ...prev,

            {
                id: null,
                school_name: "",
                major: "",
                degree: "",
                gpa: "",
                start_date: "",
                end_date: ""
            }

        ]);

    };

    const removeEducation = (index) => {

        const item = educations[index];

        if (item.id) {
            setDeletedEducationIds(prev => [...prev, item.id]);
        }

        setEducations(prev =>
            prev.filter((_, i) => i !== index)
        );
    };

    const changeExperience = (index, field, value) => {

        setExperiences(prev => {

            const list = [...prev];

            list[index] = {
                ...list[index],
                [field]: value
            };

            return list;

        });

    };

    const addExperience = () => {

        setExperiences(prev => [

            ...prev,

            {
                id: null,
                company_name: "",
                position: "",
                description: "",
                start_date: "",
                end_date: ""
            }

        ]);

    };

    const removeExperience = (index) => {

        const item = experiences[index];

        if (item.id) {
            setDeletedExperienceIds(prev => [...prev, item.id]);
        }

        setExperiences(prev =>
            prev.filter((_, i) => i !== index)
        );
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

                    <h3>HỌC VẤN</h3>

                    <hr />

                    {
                        educations.map((edu, index) => (

                            <Card
                                key={edu.id ?? index}
                                className="mb-3 shadow-sm border-0"
                            >

                                <Card.Body>

                                    <Row>

                                        <Col md={6}>

                                            <Form.Group className="mb-3">

                                                <Form.Label>
                                                    Trường
                                                </Form.Label>

                                                <Form.Control
                                                    value={edu.school_name || ""}
                                                    onChange={(e) =>
                                                        changeEducation(
                                                            index,
                                                            "school_name",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </Form.Group>

                                        </Col>

                                        <Col md={6}>

                                            <Form.Group className="mb-3">

                                                <Form.Label>
                                                    Chuyên ngành
                                                </Form.Label>

                                                <Form.Control
                                                    value={edu.major || ""}
                                                    onChange={(e) =>
                                                        changeEducation(
                                                            index,
                                                            "major",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </Form.Group>

                                        </Col>

                                    </Row>

                                    <Row>

                                        <Col md={6}>

                                            <Form.Group className="mb-3">

                                                <Form.Label>
                                                    Bằng cấp
                                                </Form.Label>

                                                <Form.Control
                                                    value={edu.degree || ""}
                                                    onChange={(e) =>
                                                        changeEducation(
                                                            index,
                                                            "degree",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </Form.Group>

                                        </Col>

                                        <Col md={6}>

                                            <Form.Group className="mb-3">

                                                <Form.Label>
                                                    GPA
                                                </Form.Label>

                                                <Form.Control
                                                    value={edu.gpa || ""}
                                                    onChange={(e) =>
                                                        changeEducation(
                                                            index,
                                                            "gpa",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </Form.Group>

                                        </Col>

                                    </Row>

                                    <Row>

                                        <Col md={6}>

                                            <Form.Group className="mb-3">

                                                <Form.Label>
                                                    Ngày bắt đầu
                                                </Form.Label>

                                                <Form.Control
                                                    type="date"
                                                    value={edu.start_date || ""}
                                                    onChange={(e) =>
                                                        changeEducation(
                                                            index,
                                                            "start_date",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </Form.Group>

                                        </Col>

                                        <Col md={6}>

                                            <Form.Group className="mb-3">

                                                <Form.Label>
                                                    Ngày kết thúc
                                                </Form.Label>

                                                <Form.Control
                                                    type="date"
                                                    value={edu.end_date || ""}
                                                    onChange={(e) =>
                                                        changeEducation(
                                                            index,
                                                            "end_date",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </Form.Group>

                                        </Col>

                                    </Row>

                                    <div className="text-end">

                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() =>
                                                removeEducation(index)
                                            }
                                        >
                                            Xóa
                                        </Button>

                                    </div>

                                </Card.Body>

                            </Card>

                        ))
                    }

                    <Button
                        variant="primary"
                        onClick={addEducation}
                    >
                        + Thêm học vấn
                    </Button>

                    <h3>KINH NGHIỆM LÀM VIỆC</h3>

                    <hr />

                    {
                        experiences.map((exp, index) => (

                            <Card
                                key={exp.id ?? index}
                                className="mb-3 shadow-sm border-0"
                            >

                                <Card.Body>

                                    <Row>

                                        <Col md={6}>

                                            <Form.Group className="mb-3">

                                                <Form.Label>
                                                    Công ty
                                                </Form.Label>

                                                <Form.Control
                                                    value={exp.company_name || ""}
                                                    onChange={(e) =>
                                                        changeExperience(
                                                            index,
                                                            "company_name",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </Form.Group>

                                        </Col>

                                        <Col md={6}>

                                            <Form.Group className="mb-3">

                                                <Form.Label>
                                                    Chức vụ
                                                </Form.Label>

                                                <Form.Control
                                                    value={exp.position || ""}
                                                    onChange={(e) =>
                                                        changeExperience(
                                                            index,
                                                            "position",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </Form.Group>

                                        </Col>

                                    </Row>

                                    <Form.Group className="mb-3">

                                        <Form.Label>
                                            Mô tả công việc
                                        </Form.Label>

                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            value={exp.description || ""}
                                            onChange={(e) =>
                                                changeExperience(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </Form.Group>

                                    <Row>

                                        <Col md={6}>

                                            <Form.Group className="mb-3">

                                                <Form.Label>
                                                    Ngày bắt đầu
                                                </Form.Label>

                                                <Form.Control
                                                    type="date"
                                                    value={exp.start_date || ""}
                                                    onChange={(e) =>
                                                        changeExperience(
                                                            index,
                                                            "start_date",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </Form.Group>

                                        </Col>

                                        <Col md={6}>

                                            <Form.Group className="mb-3">

                                                <Form.Label>
                                                    Ngày kết thúc
                                                </Form.Label>

                                                <Form.Control
                                                    type="date"
                                                    value={exp.end_date || ""}
                                                    onChange={(e) =>
                                                        changeExperience(
                                                            index,
                                                            "end_date",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </Form.Group>

                                        </Col>

                                    </Row>

                                    <div className="text-end">

                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() =>
                                                removeExperience(index)
                                            }
                                        >
                                            Xóa
                                        </Button>

                                    </div>

                                </Card.Body>

                            </Card>

                        ))
                    }

                    <Button
                        variant="primary"
                        onClick={addExperience}
                    >
                        + Thêm kinh nghiệm
                    </Button>

                </Col>

            </Row>

        </Card>

    );

};

export default CVTemplate1;
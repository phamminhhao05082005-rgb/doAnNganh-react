import {
    Card,
    Row,
    Col,
    Image,
    Badge
} from "react-bootstrap";

import dayjs from "dayjs";

const CVTemplate1Preview = ({ cv }) => {

    return (

        <Card
            className="shadow-lg border-0"
            style={{
                width: "210mm",
                minHeight: "297mm",
                margin: "0 auto",
                background: "#fff"
            }}
        >

            <Row className="g-0">

                {/* LEFT */}

                <Col
                    md={4}
                    className="bg-dark text-white p-4"
                >

                    <div className="text-center">

                        <Image
                            src={
                                cv.avatar ||
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

                        <h2
                            className="mt-3 mb-1"
                        >
                            {cv.full_name}
                        </h2>

                        <div
                            className="text-light"
                        >
                            {cv.job_title}
                        </div>

                    </div>

                    <hr />

                    <h5>THÔNG TIN LIÊN HỆ</h5>

                    <div className="mb-2">

                        <strong>Email</strong>

                        <div>
                            {cv.email || "-"}
                        </div>

                    </div>

                    <div className="mb-2">

                        <strong>Số điện thoại</strong>

                        <div>
                            {cv.phone || "-"}
                        </div>

                    </div>

                    <div className="mb-2">

                        <strong>Lương mong muốn</strong>

                        <div>

                            {

                                cv.expected_salary ?

                                    Number(
                                        cv.expected_salary
                                    ).toLocaleString("vi-VN")

                                    + " VNĐ"

                                    :

                                    "-"

                            }

                        </div>

                    </div>

                    <div className="mb-2">

                        <strong>Kinh nghiệm</strong>

                        <div>

                            {

                                cv.experience_year || 0

                            }

                            {" năm"}

                        </div>

                    </div>

                    {

                        cv.skills &&
                        cv.skills.length > 0 &&

                        <>

                            <hr />

                            <h5>KỸ NĂNG</h5>

                            {

                                cv.skills.map(skill => (

                                    <Badge
                                        key={skill.id}
                                        bg="primary"
                                        className="me-2 mb-2"
                                    >

                                        {

                                            skill.name

                                        }

                                    </Badge>

                                ))

                            }

                        </>

                    }

                </Col>

                {/* RIGHT */}

                <Col
                    md={8}
                    className="p-5"
                >

                    <h2
                        className="fw-bold"
                    >

                        {

                            cv.title

                        }

                    </h2>

                    <hr />

                    <h4
                        className="fw-bold"
                    >
                        GIỚI THIỆU
                    </h4>

                    <p
                        style={{
                            whiteSpace:
                                "pre-line",
                            textAlign:
                                "justify"
                        }}
                    >

                        {

                            cv.summary ||

                            "Chưa cập nhật."

                        }

                    </p>

                    <hr className="my-4" />

                    <h4 className="fw-bold mb-4">
                        HỌC VẤN
                    </h4>

                    {

                        cv.educations &&
                            cv.educations.length > 0 ?

                            (

                                cv.educations.map(edu => (

                                    <Card
                                        key={edu.id}
                                        className="border-0 mb-3"
                                    >

                                        <Card.Body className="p-0">

                                            <h5 className="fw-bold">

                                                {

                                                    edu.school_name

                                                }

                                            </h5>

                                            <div className="text-primary fw-semibold">

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

                                                    GPA: {

                                                        edu.gpa

                                                    }

                                                </div>

                                            }

                                            <small
                                                className="text-muted"
                                            >

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

                                    Chưa cập nhật học vấn.

                                </p>

                            )

                    }

                    <hr className="my-4" />

                    <h4 className="fw-bold mb-4">
                        KINH NGHIỆM LÀM VIỆC
                    </h4>

                    {

                        cv.experiences &&
                            cv.experiences.length > 0 ?

                            (

                                cv.experiences.map(exp => (

                                    <Card
                                        key={exp.id}
                                        className="border-0 mb-4"
                                    >

                                        <Card.Body className="p-0">

                                            <h5 className="fw-bold">

                                                {

                                                    exp.company_name

                                                }

                                            </h5>

                                            <div className="text-primary fw-semibold">

                                                {

                                                    exp.position

                                                }

                                            </div>

                                            <small
                                                className="text-muted"
                                            >

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

                                            {

                                                exp.description &&

                                                <p
                                                    className="mt-3"
                                                    style={{
                                                        whiteSpace: "pre-line",
                                                        textAlign: "justify"
                                                    }}
                                                >

                                                    {

                                                        exp.description

                                                    }

                                                </p>

                                            }

                                        </Card.Body>

                                    </Card>

                                ))

                            )

                            :

                            (

                                <p className="text-muted">

                                    Chưa cập nhật kinh nghiệm.

                                </p>

                            )

                    }

                </Col>

            </Row>

        </Card>

    );

};

export default CVTemplate1Preview;
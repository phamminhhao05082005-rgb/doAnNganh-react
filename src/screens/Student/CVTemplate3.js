import { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Image,
    Badge,
    Spinner
} from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";

const CVTemplate3 = () => {

    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState(null);

    const [educations, setEducations] = useState([]);

    const [experiences, setExperiences] = useState([]);

    const loadData = async () => {

        try {

            const [
                profileRes,
                educationRes,
                experienceRes
            ] = await Promise.all([

                authApis().get(endpoints.studentProfile),

                authApis().get(endpoints.educations),

                authApis().get(endpoints.experiences)

            ]);

            setProfile(profileRes.data.data);

            setEducations(educationRes.data.data || []);

            setExperiences(experienceRes.data.data || []);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadData();

    }, []);

    if (loading)

        return <Spinner className="mt-5" />;

    return (

        <Card
            className="shadow-lg border-0 mt-4 mb-5"
        >

            {/* HEADER */}

            <div
                className="text-white text-center p-5"
                style={{
                    background:
                        "linear-gradient(90deg,#2193b0,#6dd5ed)"
                }}
            >

                <Image

                    roundedCircle

                    src={
                        profile.avatar ||
                        "https://via.placeholder.com/180"
                    }

                    style={{
                        width: 170,
                        height: 170,
                        objectFit: "cover",
                        border: "6px solid white"
                    }}

                />

                <h1 className="mt-3 fw-bold">

                    {profile.full_name}

                </h1>

                <h4>

                    {

                        profile.title ||

                        "Full Stack Developer"

                    }

                </h4>

                <div>

                    {profile.email}

                    {" | "}

                    {

                        profile.phone ||

                        "Chưa cập nhật"

                    }

                </div>

            </div>

            <Card.Body className="p-5">

                <Row>

                    <Col md={6}>

                        <Card className="border-0 shadow-sm mb-4">

                            <Card.Body>

                                <h4
                                    className="text-primary"
                                >

                                    Giới thiệu

                                </h4>

                                <hr/>

                                <p
                                    style={{
                                        whiteSpace:
                                            "pre-line"
                                    }}
                                >

                                    {

                                        profile.summary ||

                                        "Chưa cập nhật"

                                    }

                                </p>

                            </Card.Body>

                        </Card>

                        <Card
                            className="border-0 shadow-sm"
                        >

                            <Card.Body>

                                <h4
                                    className="text-primary"
                                >

                                    Thông tin

                                </h4>

                                <hr/>

                                <p>

                                    <b>

                                        Kinh nghiệm

                                    </b>

                                    <br/>

                                    {

                                        profile.experience_year

                                    }

                                    {" "}năm

                                </p>

                                <p>

                                    <b>

                                        Mức lương mong muốn

                                    </b>

                                    <br/>

                                    {

                                        Number(
                                            profile.expected_salary
                                        ).toLocaleString()

                                    }

                                    {" "}VNĐ

                                </p>

                            </Card.Body>

                        </Card>

                    </Col>

                    <Col md={6}>

                        <Card
                            className="border-0 shadow-sm mb-4"
                        >

                            <Card.Body>

                                <h4
                                    className="text-primary"
                                >

                                    Học vấn

                                </h4>

                                <hr/>

                                {

                                    educations.map(edu => (

                                        <div
                                            key={edu.id}
                                            className="mb-4"
                                        >

                                            <Badge
                                                bg="primary"
                                            >

                                                {

                                                    edu.start_year

                                                }

                                                {" - "}

                                                {

                                                    edu.end_year ||

                                                    "Hiện tại"

                                                }

                                            </Badge>

                                            <h5 className="mt-2">

                                                {

                                                    edu.school

                                                }

                                            </h5>

                                            <div>

                                                {

                                                    edu.major

                                                }

                                            </div>

                                        </div>

                                    ))

                                }

                            </Card.Body>

                        </Card>

                        <Card
                            className="border-0 shadow-sm"
                        >

                            <Card.Body>

                                <h4
                                    className="text-primary"
                                >

                                    Kinh nghiệm

                                </h4>

                                <hr/>

                                {

                                    experiences.map(exp => (

                                        <div
                                            key={exp.id}
                                            className="mb-4"
                                        >

                                            <Badge
                                                bg="success"
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

                                                    exp.end_date

                                                    ?

                                                    dayjs(
                                                        exp.end_date
                                                    ).format(
                                                        "MM/YYYY"
                                                    )

                                                    :

                                                    "Hiện tại"

                                                }

                                            </Badge>

                                            <h5 className="mt-2">

                                                {

                                                    exp.company_name

                                                }

                                            </h5>

                                            <div
                                                className="fw-bold"
                                            >

                                                {

                                                    exp.position

                                                }

                                            </div>

                                            <p className="mt-2">

                                                {

                                                    exp.description

                                                }

                                            </p>

                                        </div>

                                    ))

                                }

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>

            </Card.Body>

        </Card>

    );

};

export default CVTemplate3;
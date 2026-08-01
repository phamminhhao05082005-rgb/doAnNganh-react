import { useEffect, useState } from "react";
import {
    Card,
    Spinner,
    Image,
    Badge
} from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";

const CVTemplate2 = () => {

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

        } catch (err) {

            console.error(err);

        } finally {

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
            className="shadow-lg mt-4 mb-5 border-0"
            style={{
                maxWidth: "900px",
                margin: "auto"
            }}
        >

            <Card.Body className="p-5">

                <div className="text-center">

                    <Image
                        roundedCircle
                        src={
                            profile.avatar ||
                            "https://via.placeholder.com/160"
                        }
                        style={{
                            width: 150,
                            height: 150,
                            objectFit: "cover"
                        }}
                    />

                    <h1 className="mt-3 fw-bold">

                        {profile.full_name}

                    </h1>

                    <Badge
                        bg="dark"
                        className="fs-6"
                    >
                        {profile.title || "Chưa cập nhật"}
                    </Badge>

                    <div className="mt-3">

                        {profile.email}

                        {" | "}

                        {profile.phone || "Chưa có"}

                    </div>

                </div>

                <hr className="my-4"/>

                <h4 className="fw-bold">

                    GIỚI THIỆU

                </h4>

                <p
                    style={{
                        whiteSpace: "pre-line"
                    }}
                >

                    {

                        profile.summary ||

                        "Chưa cập nhật"

                    }

                </p>

                <hr/>

                <h4 className="fw-bold">

                    HỌC VẤN

                </h4>

                {

                    educations.length === 0 ?

                    <p>Chưa có dữ liệu.</p>

                    :

                    educations.map(edu => (

                        <div
                            key={edu.id}
                            className="mb-4"
                        >

                            <h5>

                                {edu.school}

                            </h5>

                            <div>

                                {edu.major}

                            </div>

                            <small className="text-muted">

                                {edu.start_year}

                                {" - "}

                                {

                                    edu.end_year ||

                                    "Hiện tại"

                                }

                            </small>

                        </div>

                    ))

                }

                <hr/>

                <h4 className="fw-bold">

                    KINH NGHIỆM

                </h4>

                {

                    experiences.length === 0 ?

                    <p>Chưa có dữ liệu.</p>

                    :

                    experiences.map(exp => (

                        <div
                            key={exp.id}
                            className="mb-4"
                        >

                            <h5>

                                {exp.company_name}

                            </h5>

                            <div className="text-primary fw-bold">

                                {exp.position}

                            </div>

                            <small className="text-muted">

                                {

                                    dayjs(
                                        exp.start_date
                                    ).format("MM/YYYY")

                                }

                                {" - "}

                                {

                                    exp.end_date

                                    ?

                                    dayjs(
                                        exp.end_date
                                    ).format("MM/YYYY")

                                    :

                                    "Hiện tại"

                                }

                            </small>

                            <p
                                className="mt-2"
                                style={{
                                    whiteSpace:"pre-line"
                                }}
                            >

                                {exp.description}

                            </p>

                        </div>

                    ))

                }

                <hr/>

                <h4 className="fw-bold">

                    THÔNG TIN KHÁC

                </h4>

                <p>

                    <b>Số năm kinh nghiệm:</b>

                    {" "}

                    {

                        profile.experience_year

                    }

                </p>

                <p>

                    <b>Mức lương mong muốn:</b>

                    {" "}

                    {

                        Number(
                            profile.expected_salary
                        ).toLocaleString()

                    }

                    {" "}VNĐ

                </p>

            </Card.Body>

        </Card>

    );

};

export default CVTemplate2;
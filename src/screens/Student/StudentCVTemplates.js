import { useEffect, useState } from "react";
import {Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";

const StudentCVTemplates = () => {
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadTemplates = async () => {

        try {

            const res = await authApis().get(
                endpoints.cvTemplates
            );

            setTemplates(res.data.data);

        } catch (err) {

            console.error(err);

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

            navigate(`/student/cvs/${cv.id}`);

        } catch (err) {

            console.log(err.response);

            console.log(err.response?.data);

            alert(JSON.stringify(err.response?.data));

        }

    };

    useEffect(() => {

        loadTemplates();

    }, []);

    if (loading)

        return <Spinner className="mt-5" />;

    return (

        <>

            <h2 className="mt-4 mb-4">

                Chọn mẫu CV

            </h2>

            <Row>

                {

                    templates.map(t => (

                        <Col
                            md={4}
                            key={t.id}
                            className="mb-4"
                        >

                            <Card className="shadow h-100">

                                <Card.Img
                                    variant="top"
                                    src={t.thumbnail}
                                    style={{
                                        height: 250,
                                        objectFit: "cover"
                                    }}
                                />

                                <Card.Body>

                                    <h5>

                                        {t.name}

                                    </h5>

                                    <p>

                                        {t.description}

                                    </p>

                                </Card.Body>

                                <Card.Footer>

                                    <Button
                                        className="w-100"
                                        onClick={() => createCV(t.id)}
                                    >
                                        Sử dụng mẫu này
                                    </Button>

                                </Card.Footer>

                            </Card>

                        </Col>

                    ))

                }

            </Row>

        </>

    );

};

export default StudentCVTemplates;
import { useEffect, useState } from "react";
import {
    Form,
    Button,
    Card
} from "react-bootstrap";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import {
    authApis,
    endpoints
} from "../../configs/Apis";

const JobForm = () => {

    const { id } = useParams();

    const nav = useNavigate();

    const [categories, setCategories] = useState([]);

    const [skills, setSkills] = useState([]);

    const [data, setData] = useState({

        category_id: "",

        title: "",

        description: "",

        requirement: "",

        salary_min: "",

        salary_max: "",

        location: "",

        experience: "",

        deadline: "",

        status: true,

        skills: []

    });

    const loadMasterData = async () => {

        const [c, s] = await Promise.all([

            authApis().get(endpoints.categories),

            authApis().get(endpoints.skills)

        ]);

        setCategories(c.data.data);
        setSkills(s.data.data);

    }

    const loadJob = async () => {

        if (!id)
            return;

        const res = await authApis().get(
            endpoints.jobDetail(id)
        );

        const job = res.data.data;

        setData({

            category_id: job.category_id,

            title: job.title,

            description: job.description,

            requirement: job.requirement,

            salary_min: job.salary_min,

            salary_max: job.salary_max,

            location: job.location,

            experience: job.experience,

            deadline: job.deadline,

            status: job.status,

            skills: job.skills.map(s => s.id)

        });

    }

    useEffect(() => {

        loadMasterData();

        loadJob();

    }, []);

    const change = (field, value) => {

        setData({

            ...data,

            [field]: value

        });

    }

    const toggleSkill = (skillId) => {

        if (data.skills.includes(skillId)) {

            change(

                "skills",

                data.skills.filter(i => i !== skillId)

            );

        } else {

            change(

                "skills",

                [...data.skills, skillId]

            );

        }

    }

    const save = async (e) => {

        e.preventDefault();

        if (id) {

            await authApis().put(

                endpoints.updateJob(id),

                data

            );

        } else {

            await authApis().post(

                endpoints.createJob,

                data

            );

        }

        alert("Thành công");

        nav("/employer/jobs");

    }

    return (

        <Card className="mt-4">

            <Card.Header>

                <h3>

                    {

                        id

                            ?

                            "Cập nhật tin tuyển dụng"

                            :

                            "Đăng tin tuyển dụng"

                    }

                </h3>

            </Card.Header>

            <Card.Body>

                <Form onSubmit={save}>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Tiêu đề

                        </Form.Label>

                        <Form.Control

                            value={data.title}

                            onChange={(e) =>

                                change(

                                    "title",

                                    e.target.value

                                )

                            }

                        />

                    </Form.Group>


                    <Form.Group className="mb-3">

                        <Form.Label>

                            Danh mục

                        </Form.Label>

                        <Form.Select

                            value={data.category_id}

                            onChange={(e) =>

                                change(

                                    "category_id",

                                    e.target.value

                                )

                            }

                        >

                            <option>

                                Chọn danh mục

                            </option>

                            {

                                categories.map(c =>

                                    <option

                                        key={c.id}

                                        value={c.id}

                                    >

                                        {c.name}

                                    </option>

                                )

                            }

                        </Form.Select>

                    </Form.Group>


                    <Form.Group className="mb-3">

                        <Form.Label>

                            Địa điểm

                        </Form.Label>

                        <Form.Control

                            value={data.location}

                            onChange={(e) =>

                                change(

                                    "location",

                                    e.target.value

                                )

                            }

                        />

                    </Form.Group>


                    <Form.Group className="mb-3">

                        <Form.Label>

                            Kinh nghiệm

                        </Form.Label>

                        <Form.Control

                            value={data.experience}

                            onChange={(e) =>

                                change(

                                    "experience",

                                    e.target.value

                                )

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Lương tối thiểu theo giờ

                        </Form.Label>

                        <Form.Control

                            type="number"

                            value={data.salary_min}

                            onChange={(e) =>

                                change(

                                    "salary_min",

                                    e.target.value

                                )

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Lương tối đa theo giờ

                        </Form.Label>

                        <Form.Control

                            type="number"

                            value={data.salary_max}

                            onChange={(e) =>

                                change(

                                    "salary_max",

                                    e.target.value

                                )

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Hạn nộp

                        </Form.Label>

                        <Form.Control

                            type="date"

                            value={data.deadline}

                            onChange={(e) =>

                                change(

                                    "deadline",

                                    e.target.value

                                )

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Mô tả

                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={5}

                            value={data.description}

                            onChange={(e) =>

                                change(

                                    "description",

                                    e.target.value

                                )

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Yêu cầu

                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={5}

                            value={data.requirement}

                            onChange={(e) =>

                                change(

                                    "requirement",

                                    e.target.value

                                )

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Kỹ năng

                        </Form.Label>

                        {

                            skills.map(skill =>

                                <Form.Check

                                    key={skill.id}

                                    type="checkbox"

                                    label={skill.name}

                                    checked={

                                        data.skills.includes(skill.id)

                                    }

                                    onChange={() =>

                                        toggleSkill(skill.id)

                                    }

                                />

                            )

                        }

                    </Form.Group>

                    <Button type="submit">

                        Lưu

                    </Button>

                </Form>

            </Card.Body>

        </Card>

    );

}

export default JobForm;
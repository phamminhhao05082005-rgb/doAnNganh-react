import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const CompanyProfile = () => {

    const [company, setCompany] = useState(null);

    const loadCompany = async () => {

        const res = await authApis().get(
            endpoints["myCompany"]
        );

        setCompany(res.data.data);
    }

    useEffect(() => {
        loadCompany();
    }, []);

    if (!company)
        return <Spinner className="mt-5" />

    return (

        <Card className="mt-4">

            <Card.Header>

                <h3>

                    Thông tin doanh nghiệp

                </h3>

            </Card.Header>

            <Card.Body>

                <p>

                    <b>Tên công ty:</b>

                    {company.name}

                </p>

                <p>

                    <b>Người đại diện:</b>

                    {company.owner.full_name}

                </p>

                <p>

                    <b>Email:</b>

                    {company.owner.email}

                </p>

                <p>

                    <b>Điện thoại:</b>

                    {company.owner.phone}

                </p>

                <p>

                    <b>Website:</b>

                    {company.website}

                </p>

                <p>

                    <b>Địa chỉ:</b>

                    {company.address}

                </p>

                <p>

                    <b>Mô tả:</b>

                    {company.description}

                </p>

                <Link
                    to="/employer/company/edit"
                    state={company}
                >

                    <Button>

                        Chỉnh sửa

                    </Button>

                </Link>

            </Card.Body>

        </Card>

    )

}

export default CompanyProfile;
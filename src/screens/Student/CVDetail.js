import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { authApis, endpoints } from "../../configs/Apis";

import CVTemplate1 from "./CVTemplate1";
import CVTemplate2 from "./CVTemplate2";
import CVTemplate3 from "./CVTemplate3";

const CVDetail = () => {

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [cv, setCV] = useState(null);

    const loadCV = async (showLoading = true) => {

    if (showLoading)
        setLoading(true);

    try {

        const res = await authApis().get(
            endpoints.cv(id)
        );

        setCV(res.data.data);

    }

    catch (err) {

        console.error(err);

    }

    finally {

        if (showLoading)
            setLoading(false);

    }

};

    useEffect(() => {

        loadCV();

    }, [id]);

   const updateCV = async (data) => {

    try {

        const {

            educations,
            experiences,
            deletedEducationIds,
            deletedExperienceIds,

            ...cvData

        } = data;

        await authApis().put(

            endpoints.cv(id),

            cvData

        );

        for (const edu of educations) {

            if (edu.id) {

                await authApis().put(

                    endpoints.cvEducation(id, edu.id),

                    edu

                );

            } else {

                await authApis().post(

                    endpoints.cvEducations(id),

                    edu

                );

            }

        }

        for (const eduId of deletedEducationIds) {

            await authApis().delete(

                endpoints.cvEducation(id, eduId)

            );

        }

        for (const exp of experiences) {

            if (exp.id) {

                await authApis().put(

                    endpoints.cvExperience(id, exp.id),

                    exp

                );

            } else {

                await authApis().post(

                    endpoints.cvExperiences(id),

                    exp

                );

            }

        }

        for (const expId of deletedExperienceIds) {

            await authApis().delete(

                endpoints.cvExperience(id, expId)

            );

        }

        await loadCV(false);

        alert("Lưu thành công!");

    }

    catch (err) {

        console.error(err);

        alert("Lưu thất bại!");

    }

};

    if (loading)

        return <Spinner className="mt-5" />;

    if (!cv)

        return <h3>Không tìm thấy CV</h3>;

    switch (cv.template_id) {

        case 1:

            return (

                <CVTemplate1

                    cv={cv}

                    onSave={updateCV}

                />

            );

        case 2:

            return (

                <CVTemplate2

                    cv={cv}

                    onSave={updateCV}

                />

            );

        case 3:

            return (

                <CVTemplate3

                    cv={cv}

                    onSave={updateCV}

                />

            );

        default:

            return <h3>Template không tồn tại</h3>;

    }

};

export default CVDetail;
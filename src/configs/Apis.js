import axios from "axios";
import cookies from "react-cookies";

export const endpoints = {

    login: "/auth/login",

    googleLogin: "/auth/google-login",

    me: "/auth/me",

    logout: "/auth/logout",

    myCompany: "/auth/employer/company",

    updateMyCompany: "/auth/employer/company",

    myJobs: "/auth/employer/myJobs",

    allJobs: "/auth/jobs",

    jobDetail: (id) => `/auth/jobs/${id}`,

    createJob: "/auth/employer/jobs",

    updateJob: (id) => `/auth/employer/jobs/${id}`,

    deleteJob: (id) => `/auth/employer/jobs/${id}`,

    categories: "/auth/categories",

    skills: "/auth/skills",

};

export const authApis = () => {

    const token = cookies.load("token");

    return axios.create({

        baseURL: "http://127.0.0.1:8000/api",

        headers: {

            Authorization: token
                ? `Bearer ${token}`
                : ""

        }

    });

}

export default axios.create({

    baseURL: "http://127.0.0.1:8000/api"

});
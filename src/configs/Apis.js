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

    bookmarks: "/auth/student/bookmarks",

    bookmark: (jobId) =>
        `/auth/student/bookmarks/${jobId}`,

    unBookmark: (jobId) =>
        `/auth/student/bookmarks/${jobId}`,

    studentProfile: "/auth/student/profile",

    updateStudentProfile: "/auth/student/profile",

    educations: "/auth/student/educations",
    education: (id) => `/auth/student/educations/${id}`,

    experiences: "/auth/student/experiences",
    experience: (id) => `/auth/student/experiences/${id}`,

    cvTemplates: "/auth/student/cv-templates",

    cvTemplate: (id) =>
        `/auth/student/cv-templates/${id}`,

    cvs: "/auth/student/cvs",
    cv: (id) => `/auth/student/cvs/${id}`,

    cvEducations: (cvId) =>
        `/auth/student/cvs/${cvId}/educations`,

    cvEducation: (cvId, id) =>
        `/auth/student/cvs/${cvId}/educations/${id}`,

    cvExperiences: (cvId) =>
        `/auth/student/cvs/${cvId}/experiences`,

    cvExperience: (cvId, id) =>
        `/auth/student/cvs/${cvId}/experiences/${id}`,

    applications: "/auth/student/applications",
    myApplications: "/auth/student/applications",

    deleteApplication: (id) =>
        `/auth/student/applications/${id}`,

    employerApplications: (jobId) =>
        `/auth/employer/jobs/${jobId}/applications`,

    evaluateJobCvs: (jobId) =>
        `auth/employer/jobs/${jobId}/evaluate-cvs`,

    updateApplicationStatus: (id) =>
        `/auth/employer/applications/${id}/status`,

    notifications: "/auth/notifications",

    markNotificationRead: (id) => `/auth/notifications/${id}/read`,

    employerCvDetail: (applicationId) => `/auth/employer/applications/${applicationId}/cv`,

    getCompanyById: (id) => `/auth/companies/${id}`,

    companyReviews: (companyId) => `/companies/${companyId}/reviews`,
    addReview: "/auth/student/reviews",
    updateReview: (id) => `/auth/student/reviews/${id}`,
    deleteReview: (id) => `/auth/student/reviews/${id}`,

    employerStatistics: "/auth/employer/statistics",
};

export const authApis = () => {

    const token = cookies.load("token");

    return axios.create({

        baseURL: "http://127.0.0.1:8000/api",

        headers: {
            Authorization: token ? `Bearer ${token}` : ""
        }

    });

}

export default axios.create({
    baseURL: "http://127.0.0.1:8000/api"
});
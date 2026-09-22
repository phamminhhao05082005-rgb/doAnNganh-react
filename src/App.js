import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./screens/Auth/Login";
import StudentHome from "./screens/Student/StudentHome";
import EmployerHome from "./screens/Employer/EmployerHome";
import { Container } from "react-bootstrap";
import { useReducer } from "react";
import cookies from "react-cookies";
import { MyUserContext } from "./configs/Contexts";
import MyUserReducer from "./reducers/MyUserReducer";
import ProtectedRoute from './components/ProtectedRoute';
import CompanyProfile from "./screens/Employer/CompanyProfile";
import CompanyEdit from "./screens/Employer/CompanyEdit";
import EmployerJobs from "./screens/Employer/EmployerJobs";
import JobDetail from "./screens/Employer/JobDetail";
import JobForm from "./screens/Employer/JobForm";
import StudentBookmarks from "./screens/Student/StudentBookmarks";
import StudentProfile from "./screens/Student/StudentProfile";
import StudentEducations from "./screens/Student/StudentEducations";
import StudentExperiences from "./screens/Student/StudentExperiences";
import StudentCVTemplates from './screens/Student/StudentCVTemplates';
import CVTemplate1 from './screens/Student/CVTemplate1';
import CVTemplate2 from './screens/Student/CVTemplate2';
import CVTemplate3 from './screens/Student/CVTemplate3';
import StudentCVs from './screens/Student/StudentCVs';
import CVDetail from './screens/Student/CVDetail';
import StudentApplications from './screens/Student/StudentApplications';
import EmployerApplications from './screens/Employer/EmployerApplications';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  const [user, dispatch] = useReducer(
    MyUserReducer,
    cookies.load("user") || null
  );

  return (

    <MyUserContext.Provider value={[user, dispatch]}>

      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

        <Header />

        <Container>

          <Routes>

            <Route path="/" element={<Login />} />

            <Route

              path="/student"

              element={

                <ProtectedRoute roles={["STUDENT"]}>

                  <StudentHome />

                </ProtectedRoute>

              }

            />

            <Route
              path="/student/bookmarks"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <StudentBookmarks />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/profile"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/educations"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <StudentEducations />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/experiences"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <StudentExperiences />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/cvs"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <StudentCVTemplates />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/cvs/:id"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <CVDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/cvs/manage"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <StudentCVs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/applications"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <StudentApplications />
                </ProtectedRoute>
              }
            />

            <Route

              path="/employer"

              element={

                <ProtectedRoute

                  roles={["EMPLOYER"]}>
                  <EmployerHome />

                </ProtectedRoute>

              }

            />

            <Route
              path="/employer/company"
              element={
                <ProtectedRoute
                  roles={["EMPLOYER"]}
                >
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/companies/:companyId"
              element={
                <ProtectedRoute roles={["STUDENT", "EMPLOYER"]}>
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/company/edit"
              element={
                <ProtectedRoute
                  roles={["EMPLOYER"]}
                >
                  <CompanyEdit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/jobs"
              element={
                <ProtectedRoute roles={["EMPLOYER"]}>
                  <EmployerJobs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/jobs/create"
              element={
                <ProtectedRoute roles={["EMPLOYER"]}>
                  <JobForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/jobs/:id"
              element={
                <ProtectedRoute roles={["EMPLOYER", "STUDENT"]}>
                  <JobDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/jobs/:id/edit"
              element={
                <ProtectedRoute roles={["EMPLOYER"]}>
                  <JobForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/jobs/:jobId/applications"
              element={
                <ProtectedRoute roles={["EMPLOYER"]}>
                  <EmployerApplications />
                </ProtectedRoute>
              }
            />

            {/* <Route
              path="/employer/jobs/:jobId/applications/:applicationId"
              element={
                <ProtectedRoute roles={["EMPLOYER"]}>
                  <CVDetail />
                </ProtectedRoute>
              }
            /> */}

            <Route
              path="/employer/applications/:applicationId/cv"
              element={
                <ProtectedRoute roles={["EMPLOYER"]}>
                  <CVDetail />
                </ProtectedRoute>
              }
            />

          </Routes>

        </Container>

        <Footer />

      </BrowserRouter>

    </MyUserContext.Provider>

  )

}

export default App;
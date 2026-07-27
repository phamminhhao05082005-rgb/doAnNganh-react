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

function App() {

  const [user, dispatch] = useReducer(
    MyUserReducer,
    cookies.load("user") || null
  );

  return (

    <MyUserContext.Provider value={[user, dispatch]}>

      <BrowserRouter>

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

          </Routes>

        </Container>

        <Footer />

      </BrowserRouter>

    </MyUserContext.Provider>

  )

}

export default App;
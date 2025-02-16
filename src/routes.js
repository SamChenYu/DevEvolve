import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientRegistration from "./components/auth/ClientRegistration";
import DeveloperRegistration from "./components/auth/DeveloperRegistration";
import Login from "./components/auth/Login";
import LandingPage from "./LandingPage";
import DeveloperDashboard from "./components/dashboard/DeveloperDashboard";
import ClientDashboard from "./components/dashboard/ClientDashboard";
import CreateProjectForm from "./components/projects/CreateProjectForm";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/client-registration" element={<ClientRegistration />} />
                <Route path="/developer-registration" element={<DeveloperRegistration />} />
                <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/create-project" element={<CreateProjectForm />} />
            </Routes>
        </Router>
    );
    };

export default AppRoutes;
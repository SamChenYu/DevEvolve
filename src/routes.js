import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientRegistration from "./components/auth/ClientRegistration";
import DeveloperRegistration from "./components/auth/DeveloperRegistration";
import Login from "./components/auth/Login";
import LandingPage from "./LandingPage";
import DeveloperDashboard from "./components/dashboard/DeveloperDashboard";
import ClientDashboard from "./components/dashboard/ClientDashboard";
import CreateProjectForm from "./components/projects/CreateProjectForm";
import ProjectDetails from "./components/projects/ProjectDetails";
import BrowseDevelopers from "./components/browse/BrowseDevelopers";
import BrowseProjects from "./components/browse/BrowseProjects";
import BrowseProjectItemDetails from "./components/browse/BrowseProjectItemDetails";
import DevProfile from "./components/profile/DevProfile";
import Logout from "./components/auth/Logout";

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
                <Route path="/projects/:clientId/:projectId" element={<ProjectDetails />} />
                <Route path="/browse-developers" element={<BrowseDevelopers />} />
                <Route path="/browse-projects" element={<BrowseProjects />} />
                <Route path="/project-details/:projectId" element={<BrowseProjectItemDetails />} />
                <Route path="/developer/:id" element={<DevProfile />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </Router>
    );
    };

export default AppRoutes;
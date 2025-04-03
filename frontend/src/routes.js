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
import BrowseClients from "./components/browse/BrowseClients";
import BrowseProjects from "./components/browse/BrowseProjects";
import BrowseProjectItemDetails from "./components/browse/BrowseProjectItemDetails";
import DevProfile from "./components/profile/DevProfile";
import Logout from "./components/auth/Logout";
import BidList from "./components/bids/BidList";
import Chat from "./components/chat/Chat";
import DevProfilePage from "./components/profile/DevProfilePage";
import ClientProfilePage from "./components/profile/ClientProfilePage";
import Shop from "./components/purchase/Shop";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import CreateIssueForm from "./components/Issues/CreateIssueForm";
import AdminChat from "./components/chat/AdminChat";


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/client-registration" element={<ClientRegistration />} />
                <Route path="/developer-registration" element={<DeveloperRegistration />} />
                <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/create-project" element={<CreateProjectForm />} />
                <Route path="/projects/:clientId/:projectId" element={<ProjectDetails />} />
                <Route path="/browse-developers" element={<BrowseDevelopers />} />
                <Route path="/browse-clients" element={<BrowseClients/>} />
                <Route path="/browse-projects" element={<BrowseProjects />} />
                <Route path="/project-details/:projectId" element={<BrowseProjectItemDetails />} />
                <Route path="/developer/:id" element={<DevProfile />} />
                <Route path="/your-bids" element={<BidList />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/dev-profile/:id" element={<DevProfilePage />} />
                <Route path="/client-profile/:id" element={<ClientProfilePage />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/report-issue" element={<CreateIssueForm />} />
                <Route path="/admin-chat" element={<AdminChat />} />
            </Routes>
        </Router>
    );
    };

export default AppRoutes;
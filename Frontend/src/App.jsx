import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CandidateDashboard from "./dashboard/CandidateDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Applications from "./pages/Applications";
import ApplicationDetails from "./pages/ApplicationDetails";
import Profile from "./pages/Profile";
import RecruiterDashboard from "./dashboard/RecruiterDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import CreateJob from "./pages/createJob";
import MyJobs from "./pages/myJobs";
import Applicants from "./pages/applicants";
import CandidateDetails from "./pages/CandidateDetails";
import ManageUsers from "./admin/ManageUsers";
import ManageJobs from "./admin/ManageJobs";
import VerifyRecruiters from "./admin/VerifyRecruiters";
import ProtectedRoute from "./components/ProtectedRoute";
// New advanced pages
import BrowseJobs from "./pages/BrowseJobs";
import JobDetails from "./pages/JobDetails";
import EditJob from "./pages/EditJob";
import Notifications from "./pages/Notifications";
import AdminAnalytics from "./pages/AdminAnalytics";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate Routes - Protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <CandidateDashboard />
          </ProtectedRoute>
        } />
        <Route path="/applications" element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <Applications />
          </ProtectedRoute>
        } />
        <Route path="/application/:applicationId" element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <ApplicationDetails />
          </ProtectedRoute>
        } />
        <Route path="/browse-jobs" element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <BrowseJobs />
          </ProtectedRoute>
        } />
        <Route path="/job/:jobId" element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <JobDetails />
          </ProtectedRoute>
        } />
        
        {/* Profile - All authenticated users */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Recruiter Routes - Protected */}
        <Route path="/recruiter" element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterDashboard />
          </ProtectedRoute>
        } />
        <Route path="/create-job" element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <CreateJob />
          </ProtectedRoute>
        } />
        <Route path="/my-jobs" element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <MyJobs />
          </ProtectedRoute>
        } />
        <Route path="/edit-job/:jobId" element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <EditJob />
          </ProtectedRoute>
        } />
        <Route path="/applicants/:jobId" element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <Applicants />
          </ProtectedRoute>
        } />
        <Route path="/candidate/:candidateId/:jobId" element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <CandidateDetails />
          </ProtectedRoute>
        } />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/jobs" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageJobs />
          </ProtectedRoute>
        } />
        <Route path="/admin/recruiters" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <VerifyRecruiters />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAnalytics />
          </ProtectedRoute>
        } />

        {/* Notifications - All authenticated users */}
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
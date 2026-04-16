import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";
import { Search, MapPin, DollarSign, Building2, Filter } from "lucide-react";

function BrowseJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [currentPage, searchQuery, locationFilter, companyFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };
      if (searchQuery) params.keyword = searchQuery;
      if (locationFilter) params.location = locationFilter;
      if (companyFilter) params.company = companyFilter;

      const res = await axiosInstance.get("/jobs", { params });
      setJobs(res.data.data.jobs || []);
      setTotalJobs(res.data.data.totalJobs || 0);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get("/applications/my-applications");
      setApplications(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axiosInstance.post(`/applications/${jobId}/apply`);
      alert("Applied successfully!");
      fetchApplications();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setCompanyFilter("");
    setCurrentPage(1);
  };

  const hasApplied = (jobId) => {
    return applications.some(a => a.job?._id === jobId || a.job === jobId);
  };

  const formatSalary = (salary) => {
    if (salary >= 1000000) {
      return `₹${(salary / 100000).toFixed(1)}L/yr`;
    } else if (salary >= 100000) {
      return `₹${(salary / 1000).toFixed(0)}K/yr`;
    }
    return `₹${salary.toLocaleString('en-IN')}/yr`;
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 8px" }}>
            Browse Jobs
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(240,237,234,0.5)", margin: 0 }}>
            {totalJobs} opportunities available
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
          <div style={{
            display: "flex",
            gap: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: "16px"
          }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(240,237,234,0.3)" }} />
              <input
                type="text"
                placeholder="Search job titles, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "#F0EDEA",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "inherit"
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: "12px 20px",
                background: showFilters ? "rgba(79,142,247,0.15)" : "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: showFilters ? "#4F8EF7" : "rgba(240,237,234,0.6)",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "inherit"
              }}
            >
              <Filter size={16} />
              Filters
            </button>
            <button
              type="submit"
              style={{
                padding: "12px 28px",
                background: "linear-gradient(135deg, #4F8EF7, #6366F1)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                fontFamily: "inherit",
                boxShadow: "0 4px 12px rgba(79,142,247,0.3)"
              }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Advanced Filters */}
        {showFilters && (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: "20px",
            marginBottom: "20px"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "rgba(240,237,234,0.5)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <MapPin size={12} style={{ display: "inline", marginRight: "4px" }} />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Remote"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#F0EDEA",
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "rgba(240,237,234,0.5)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <Building2 size={12} style={{ display: "inline", marginRight: "4px" }} />
                  Company
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google, Microsoft"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#F0EDEA",
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
              </div>
            </div>
            <button
              onClick={clearFilters}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "rgba(240,237,234,0.5)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                fontFamily: "inherit"
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Jobs List */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid rgba(79,142,247,0.2)", borderTopColor: "#4F8EF7", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          </div>
        ) : jobs.length === 0 ? (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px dashed rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "80px 40px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p style={{ color: "rgba(240,237,234,0.4)", fontSize: "16px", marginBottom: "8px" }}>No jobs found</p>
            <p style={{ color: "rgba(240,237,234,0.3)", fontSize: "14px" }}>Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
              {jobs.map((job) => {
                const applied = hasApplied(job._id);
                return (
                  <div
                    key={job._id}
                    onClick={() => navigate(`/job/${job._id}`)}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "14px",
                      padding: "24px",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 8px" }}>
                          {job.title}
                        </h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "12px" }}>
                          <span style={{ fontSize: "14px", color: "rgba(240,237,234,0.5)", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Building2 size={14} />
                            {job.company}
                          </span>
                          <span style={{ fontSize: "14px", color: "rgba(240,237,234,0.5)", display: "flex", alignItems: "center", gap: "6px" }}>
                            <MapPin size={14} />
                            {job.location}
                          </span>
                          <span style={{ fontSize: "14px", color: "#4F8EF7", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                            {formatSalary(job.salary)}
                          </span>
                        </div>
                        <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.4)", margin: 0, lineHeight: "1.6" }}>
                          {job.description?.substring(0, 150)}...
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(job._id);
                        }}
                        disabled={applied}
                        style={{
                          padding: "10px 24px",
                          borderRadius: "10px",
                          border: "none",
                          cursor: applied ? "not-allowed" : "pointer",
                          fontSize: "14px",
                          fontWeight: "600",
                          background: applied ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #4F8EF7, #6366F1)",
                          color: applied ? "rgba(240,237,234,0.3)" : "#fff",
                          flexShrink: 0,
                          fontFamily: "inherit",
                          boxShadow: applied ? "none" : "0 4px 12px rgba(79,142,247,0.3)"
                        }}
                      >
                        {applied ? "Applied ✓" : "Apply Now"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: currentPage === page ? "1px solid #4F8EF7" : "1px solid rgba(255,255,255,0.1)",
                      background: currentPage === page ? "rgba(79,142,247,0.15)" : "rgba(255,255,255,0.03)",
                      color: currentPage === page ? "#4F8EF7" : "rgba(240,237,234,0.5)",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      fontFamily: "inherit"
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}

export default BrowseJobs;

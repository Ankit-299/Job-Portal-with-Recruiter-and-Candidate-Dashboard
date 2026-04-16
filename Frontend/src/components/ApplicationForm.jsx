import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { 
  ArrowLeft, ArrowRight, CheckCircle, Building2, MapPin, 
  DollarSign, Briefcase, Award, User, Phone, Mail, 
  FileText, Send
} from "lucide-react";

function ApplicationForm({ job, user, onSuccess }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: "",
    phone: user?.phone || "",
    currentLocation: user?.location || "",
    yearsOfExperience: user?.experience || "",
    expectedSalary: "",
    availableNoticePeriod: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/applications/${job._id}/apply`, formData);
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    const num = Number(salary);
    if (num >= 1000000) {
      return `₹${(num / 100000).toFixed(1)} Lakhs/year`;
    } else if (num >= 100000) {
      return `₹${(num / 1000).toFixed(0)}K/year`;
    }
    return `₹${num.toLocaleString('en-IN')}/year`;
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
    color: "#F0EDEA", fontSize: "14px", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s"
  };

  const labelStyle = {
    display: "block", fontSize: "12px", fontWeight: "600",
    color: "rgba(240,237,234,0.6)", marginBottom: "8px",
    textTransform: "uppercase", letterSpacing: "0.5px"
  };

  // Step 1: Job & Company Details
  const Step1_JobDetails = () => (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 8px" }}>
          Review Job Details
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.5)", margin: 0 }}>
          Please review the job information before applying
        </p>
      </div>

      {/* Job Card */}
      <div style={{
        background: "rgba(79,142,247,0.05)",
        border: "1px solid rgba(79,142,247,0.15)",
        borderRadius: "14px",
        padding: "24px",
        marginBottom: "24px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "14px",
            background: "linear-gradient(135deg, #4F8EF7, #6366F1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", fontWeight: "700", color: "#fff"
          }}>
            {job.company?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 4px" }}>
              {job.title}
            </h3>
            <p style={{ fontSize: "15px", color: "rgba(240,237,234,0.6)", margin: 0 }}>
              {job.company}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <MapPin size={16} style={{ color: "rgba(240,237,234,0.5)" }} />
            <div>
              <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", margin: "0 0 2px" }}>Location</p>
              <p style={{ fontSize: "14px", color: "#F0EDEA", margin: 0, fontWeight: "600" }}>{job.location}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <DollarSign size={16} style={{ color: "#4F8EF7" }} />
            <div>
              <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", margin: "0 0 2px" }}>Salary</p>
              <p style={{ fontSize: "14px", color: "#4F8EF7", margin: 0, fontWeight: "600" }}>{formatSalary(job.salary)}</p>
            </div>
          </div>
          {job.jobType && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Briefcase size={16} style={{ color: "rgba(240,237,234,0.5)" }} />
              <div>
                <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", margin: "0 0 2px" }}>Job Type</p>
                <p style={{ fontSize: "14px", color: "#F0EDEA", margin: 0, fontWeight: "600", textTransform: "capitalize" }}>
                  {job.jobType.replace("-", " ")}
                </p>
              </div>
            </div>
          )}
          {job.experienceLevel && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Award size={16} style={{ color: "rgba(240,237,234,0.5)" }} />
              <div>
                <p style={{ fontSize: "11px", color: "rgba(240,237,234,0.4)", margin: "0 0 2px" }}>Experience Level</p>
                <p style={{ fontSize: "14px", color: "#F0EDEA", margin: 0, fontWeight: "600", textTransform: "capitalize" }}>
                  {job.experienceLevel}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Description */}
      {job.description && (
        <div style={{ marginBottom: "24px" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "600", color: "rgba(240,237,234,0.6)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Job Description
          </h4>
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "16px",
            fontSize: "14px",
            color: "rgba(240,237,234,0.7)",
            lineHeight: "1.7",
            maxHeight: "200px",
            overflowY: "auto",
            whiteSpace: "pre-wrap"
          }}>
            {job.description}
          </div>
        </div>
      )}

      {/* Required Skills */}
      {job.requiredSkills?.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "600", color: "rgba(240,237,234,0.6)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Required Skills
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {job.requiredSkills.map((skill, index) => (
              <span key={index} style={{
                padding: "6px 12px",
                background: "rgba(79,142,247,0.1)",
                border: "1px solid rgba(79,142,247,0.2)",
                borderRadius: "6px",
                color: "#4F8EF7",
                fontSize: "13px",
                fontWeight: "600"
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{
        background: "rgba(245,158,11,0.05)",
        border: "1px solid rgba(245,158,11,0.15)",
        borderRadius: "10px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <FileText size={18} style={{ color: "#F59E0B" }} />
        <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.7)", margin: 0 }}>
          In the next step, you'll provide your application details and cover letter
        </p>
      </div>
    </div>
  );

  // Step 2: Application Form
  const Step2_ApplicationForm = () => (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 8px" }}>
          Application Details
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.5)", margin: 0 }}>
          Provide your information to complete the application
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Cover Letter */}
        <div>
          <label style={labelStyle}>
            Cover Letter <span style={{ color: "rgba(240,237,234,0.3)" }}>(Optional but recommended)</span>
          </label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows="6"
            placeholder="Tell us why you're a great fit for this role..."
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={e => e.target.style.borderColor = "#4F8EF7"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>

        {/* Contact Information */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>
              <Phone size={12} style={{ display: "inline", marginRight: "4px" }} />
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#4F8EF7"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <div>
            <label style={labelStyle}>
              <MapPin size={12} style={{ display: "inline", marginRight: "4px" }} />
              Current Location
            </label>
            <input
              name="currentLocation"
              type="text"
              value={formData.currentLocation}
              onChange={handleChange}
              placeholder="e.g. Bangalore, India"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#4F8EF7"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
        </div>

        {/* Experience & Salary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>
              <Award size={12} style={{ display: "inline", marginRight: "4px" }} />
              Years of Experience
            </label>
            <input
              name="yearsOfExperience"
              type="text"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              placeholder="e.g. 3 years"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#4F8EF7"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <div>
            <label style={labelStyle}>
              <DollarSign size={12} style={{ display: "inline", marginRight: "4px" }} />
              Expected Salary (Annual)
            </label>
            <input
              name="expectedSalary"
              type="text"
              value={formData.expectedSalary}
              onChange={handleChange}
              placeholder="e.g. 1200000"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#4F8EF7"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
        </div>

        {/* Notice Period */}
        <div>
          <label style={labelStyle}>
            Available Notice Period
          </label>
          <select
            name="availableNoticePeriod"
            value={formData.availableNoticePeriod}
            onChange={handleChange}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={e => e.target.style.borderColor = "#4F8EF7"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          >
            <option value="">Select notice period</option>
            <option value="immediate">Immediate Joiner</option>
            <option value="15days">15 Days</option>
            <option value="30days">30 Days</option>
            <option value="60days">60 Days</option>
            <option value="90days">90 Days</option>
            <option value="negotiable">Negotiable</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Step 3: Review & Submit
  const Step3_Review = () => (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 8px" }}>
          Review & Submit
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.5)", margin: 0 }}>
          Review your application before submitting
        </p>
      </div>

      {/* Job Summary */}
      <div style={{
        background: "rgba(79,142,247,0.05)",
        border: "1px solid rgba(79,142,247,0.15)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "24px"
      }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 12px" }}>
          Applying for
        </h3>
        <p style={{ fontSize: "18px", fontWeight: "600", color: "#F0EDEA", margin: "0 0 6px" }}>
          {job.title}
        </p>
        <p style={{ fontSize: "14px", color: "rgba(240,237,234,0.6)", margin: 0 }}>
          {job.company} · {job.location} · {formatSalary(job.salary)}
        </p>
      </div>

      {/* Application Summary */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "24px"
      }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#F0EDEA", margin: "0 0 16px" }}>
          Your Application Details
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)" }}>Name</span>
            <span style={{ fontSize: "14px", color: "#F0EDEA", fontWeight: "600" }}>{user?.name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)" }}>Email</span>
            <span style={{ fontSize: "14px", color: "#F0EDEA", fontWeight: "600" }}>{user?.email}</span>
          </div>
          {formData.phone && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)" }}>Phone</span>
              <span style={{ fontSize: "14px", color: "#F0EDEA", fontWeight: "600" }}>{formData.phone}</span>
            </div>
          )}
          {formData.currentLocation && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)" }}>Location</span>
              <span style={{ fontSize: "14px", color: "#F0EDEA", fontWeight: "600" }}>{formData.currentLocation}</span>
            </div>
          )}
          {formData.yearsOfExperience && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)" }}>Experience</span>
              <span style={{ fontSize: "14px", color: "#F0EDEA", fontWeight: "600" }}>{formData.yearsOfExperience}</span>
            </div>
          )}
          {formData.expectedSalary && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)" }}>Expected Salary</span>
              <span style={{ fontSize: "14px", color: "#4F8EF7", fontWeight: "600" }}>{formatSalary(formData.expectedSalary)}</span>
            </div>
          )}
          {formData.availableNoticePeriod && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)" }}>Notice Period</span>
              <span style={{ fontSize: "14px", color: "#F0EDEA", fontWeight: "600", textTransform: "capitalize" }}>
                {formData.availableNoticePeriod.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          )}
          {formData.coverLetter && (
            <div>
              <span style={{ fontSize: "13px", color: "rgba(240,237,234,0.5)", display: "block", marginBottom: "6px" }}>Cover Letter</span>
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "13px",
                color: "rgba(240,237,234,0.7)",
                lineHeight: "1.6",
                maxHeight: "150px",
                overflowY: "auto",
                whiteSpace: "pre-wrap"
              }}>
                {formData.coverLetter}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{
        background: "rgba(16,185,129,0.05)",
        border: "1px solid rgba(16,185,129,0.15)",
        borderRadius: "10px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <CheckCircle size={18} style={{ color: "#10B981" }} />
        <p style={{ fontSize: "13px", color: "rgba(240,237,234,0.7)", margin: 0 }}>
          Double-check all information before submitting. You cannot edit after submission.
        </p>
      </div>
    </div>
  );

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "32px"
    }}>
      {/* Progress Steps */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px", position: "relative" }}>
        <div style={{
          position: "absolute",
          top: "20px",
          left: "0",
          right: "0",
          height: "2px",
          background: "rgba(255,255,255,0.1)"
        }} />
        <div style={{
          position: "absolute",
          top: "20px",
          left: "0",
          height: "2px",
          background: "#4F8EF7",
          width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
          transition: "width 0.3s ease"
        }} />
        
        {[1, 2, 3].map((step) => (
          <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: currentStep >= step ? "#4F8EF7" : "rgba(255,255,255,0.05)",
              border: `2px solid ${currentStep >= step ? "#4F8EF7" : "rgba(255,255,255,0.1)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "700",
              marginBottom: "8px",
              transition: "all 0.3s ease"
            }}>
              {currentStep > step ? <CheckCircle size={18} /> : step}
            </div>
            <span style={{
              fontSize: "12px",
              fontWeight: "600",
              color: currentStep >= step ? "#4F8EF7" : "rgba(240,237,234,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              {step === 1 ? "Review Job" : step === 2 ? "Details" : "Submit"}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div style={{ minHeight: "400px" }}>
        {currentStep === 1 && <Step1_JobDetails />}
        {currentStep === 2 && <Step2_ApplicationForm />}
        {currentStep === 3 && <Step3_Review />}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          style={{
            padding: "12px 24px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: currentStep === 1 ? "transparent" : "rgba(255,255,255,0.05)",
            color: currentStep === 1 ? "rgba(240,237,234,0.3)" : "rgba(240,237,234,0.7)",
            cursor: currentStep === 1 ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "600",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        {currentStep < 3 ? (
          <button
            onClick={nextStep}
            style={{
              padding: "12px 32px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #4F8EF7, #6366F1)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(79,142,247,0.3)"
            }}
          >
            Next
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "12px 32px",
              borderRadius: "10px",
              border: "none",
              background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #10B981, #059669)",
              color: loading ? "rgba(240,237,234,0.3)" : "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "600",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: loading ? "none" : "0 4px 12px rgba(16,185,129,0.3)"
            }}
          >
            {loading ? (
              "Submitting..."
            ) : (
              <>
                Submit Application
                <Send size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default ApplicationForm;

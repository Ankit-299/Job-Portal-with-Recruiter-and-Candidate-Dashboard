import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, skills, experience, location, bio, company, companyWebsite } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Name, email, password and role are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
     return res.status(400).json({
     success: false,
     message: "User already exists",
});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const baseUrl = "https://job-portal-with-recruiter-and-candidate.onrender.com/";
    const resumePath = req.files?.resume ? baseUrl + req.files.resume[0].path.replace(/\\/g, "/") : null;
    const companyProofPath = req.files?.companyProof ? baseUrl + req.files.companyProof[0].path.replace(/\\/g, "/") : null;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || null,
      skills: skills || null,
      experience: experience || null,
      location: location || null,
      bio: bio || null,
      company: company || null,
      companyWebsite: companyWebsite || null,
      resume: resumePath,
      companyProof: companyProofPath,
    });

  res.status(201).json({
   success: true,
   message: "User registered successfully",
   data: {
     user: {
       _id: user._id,
       name: user.name,
       email: user.email,
       role: user.role,
       phone: user.phone,
       location: user.location,
       bio: user.bio,
       skills: user.skills,
       experience: user.experience,
       resume: user.resume,
       company: user.company,
       companyWebsite: user.companyWebsite,
       companyProof: user.companyProof,
       isVerified: user.isVerified,
       isBlocked: user.isBlocked,
     },
   },
});

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
import jwt from "jsonwebtoken";

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);
    // 1. Validate
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    console.log("User found:", user);
    
    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("password match:", isMatch, "provided:", password, "stored:", user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // 4. Check if recruiter is verified
    if (user.role === "recruiter" && !user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: "Your recruiter account is pending admin verification. Please wait for approval or contact the admin team.",
        pendingVerification: true
      });
    }

    // 5. Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          bio: user.bio,
          skills: user.skills,
          experience: user.experience,
          resume: user.resume,
          company: user.company,
          companyWebsite: user.companyWebsite,
          companyProof: user.companyProof,
          isVerified: user.isVerified,
          isBlocked: user.isBlocked,
        },
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          bio: user.bio,
          skills: user.skills,
          experience: user.experience,
          resume: user.resume,
          company: user.company,
          companyWebsite: user.companyWebsite,
          companyProof: user.companyProof,
          isVerified: user.isVerified,
          isBlocked: user.isBlocked,
        },
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, location, bio, skills, experience, company, companyWebsite } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;
    if (experience) user.experience = experience;
    if (company) user.company = company;
    if (companyWebsite) user.companyWebsite = companyWebsite;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          bio: user.bio,
          skills: user.skills,
          experience: user.experience,
          resume: user.resume,
          company: user.company,
          companyWebsite: user.companyWebsite,
          companyProof: user.companyProof,
          isVerified: user.isVerified,
          isBlocked: user.isBlocked,
        },
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
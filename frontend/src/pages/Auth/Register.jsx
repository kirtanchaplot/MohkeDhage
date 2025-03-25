// all change
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  // Validation states
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactMethodError, setContactMethodError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  // Validate contact methods
  const validateContactMethods = () => {
    if (!email && !mobile) {
      setContactMethodError("Either email or mobile number is required");
      return false;
    }
    setContactMethodError("");
    return true;
  };

  // Password validation function
  const validatePassword = (value) => {
    if (value.length < 7) {
      return "Password must be at least 7 characters long";
    }
    if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
      return "Password must contain both letters and numbers";
    }
    return "";
  };

  // Email validation function
  const validateEmail = (value) => {
    if (!value) {
      // Email is optional if mobile is provided
      if (mobile) return "";
      return "Email is required if mobile is not provided";
    }
    
    // Basic email format validation
    if (!/\S+@\S+\.\S+/.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Mobile validation function
  const validateMobile = (value) => {
    if (!value) {
      // Mobile is optional if email is provided
      if (email) return "";
      return "Mobile number is required if email is not provided";
    }
    
    if (value.length !== 10) {
      return "Mobile number must be exactly 10 digits";
    }
    if (!/^\d+$/.test(value)) {
      return "Mobile number must contain only digits";
    }
    return "";
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
    // Update contact method validation
    if (value || mobile) {
      setContactMethodError("");
    }
  };

  // Handle mobile change
  const handleMobileChange = (e) => {
    const value = e.target.value;
    setMobile(value);
    setMobileError(validateMobile(value));
    // Update contact method validation
    if (value || email) {
      setContactMethodError("");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate fields before submission
    const passError = validatePassword(password);
    const emailErr = validateEmail(email);
    const mobError = validateMobile(mobile);
    const contactValid = validateContactMethods();
    
    setPasswordError(passError);
    setEmailError(emailErr);
    setMobileError(mobError);

    if (passError || emailErr || mobError || !contactValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ 
        username, 
        email: email || undefined, 
        mobile: mobile || undefined,
        password 
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("User successfully registered");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col md:flex-row">
      {/* Left section with form */}
      <div className="w-full md:w-1/2 lg:w-2/5 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          {/* Logo or brand section - visible on mobile but hidden on medium screens where the right image has the logo */}
          <div className="flex justify-center mb-6 md:hidden">
            <h2 className="text-2xl font-bold text-pink-500">MohKeDhage</h2>
          </div>
          
          <div className="bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-xl border border-gray-700">
            <h1 className="text-2xl font-bold mb-6 text-white text-center">Create Account</h1>

            {contactMethodError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-sm text-red-400">{contactMethodError}</p>
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700/70 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email Address {!mobile && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-700/70 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                    emailError ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  required={!mobile}
                />
                {emailError && (
                  <p className="mt-1 text-xs text-red-400">{emailError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Mobile Number {!email && <span className="text-red-400">*</span>}
                </label>
                <input
                  type="tel"
                  id="mobile"
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-700/70 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                    mobileError ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  onChange={handleMobileChange}
                  maxLength={10}
                  required={!email}
                />
                {mobileError && (
                  <p className="mt-1 text-xs text-red-400">{mobileError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    className={`w-full px-4 py-3 border rounded-lg bg-gray-700/70 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      passwordError ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="Create a password (7+ chars, letters & numbers)"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                  >
                    {passwordVisible ? "Hide" : "Show"}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-xs text-red-400">{passwordError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    id="confirmPassword"
                    className={`w-full px-4 py-3 border rounded-lg bg-gray-700/70 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      confirmPassword && password !== confirmPassword
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                  >
                    {confirmPasswordVisible ? "Hide" : "Show"}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-pink-700 transition duration-300 mt-8 font-medium shadow-lg disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2" /> Registering...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-gray-300">
                  Already have an account?{" "}
                  <Link
                    to={redirect ? `/login?redirect=${redirect}` : "/login"}
                    className="text-pink-400 hover:text-pink-300 font-medium transition-colors"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-pink-400 hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-pink-400 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right section with image - optimized for different screen sizes */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden">
        {/* Logo overlay on image */}
        <div className="absolute top-8 left-8 z-10">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">FASHION STORE</h2>
          <p className="text-white/80 mt-2 max-w-xs">Discover the latest trends and express your unique style</p>
        </div>
        
        {/* Image tag with responsive sizing */}
        <img
          src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
          alt="Fashion"
          className="h-screen w-full object-cover"
        />
        
        {/* Dark overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
      </div>
    </div>
  );
};

export default Register;
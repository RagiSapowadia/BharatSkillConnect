import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegisterUser(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Trim whitespace from input fields before sending
    const cleanedData = {
      name: signUpFormData.name.trim(),
      email: signUpFormData.email.trim(),
      password: signUpFormData.password, // do not trim password
      role: signUpFormData.role.trim(),
    };
    console.log('Registering with:', cleanedData); // Debug log
    try {
      const data = await registerService(cleanedData);
      if (data.success) {
        const loginData = await loginService({
          email: cleanedData.email,
          password: cleanedData.password,
        });

        if (loginData.success) {
          sessionStorage.setItem(
            "accessToken",
            JSON.stringify(loginData.data.accessToken)
          );
          setAuth({
            authenticate: true,
            user: loginData.data.user,
          });
          // Redirect based on role
          if (loginData.data.user.role === "teacher") {
            navigate("/instructor");
          } else {
            navigate("/");
          }
          toast({ title: "Registration successful", description: "Welcome to BharatSkillConnect!" });
        } else {
          toast({ title: "Login failed after registration", variant: "destructive" });
        }
      } else {
        toast({ title: data.message || "Registration failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: error?.response?.data?.message || "Registration failed", variant: "destructive" });
    }
    finally {
      setIsSubmitting(false);
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        if (data.data.user.role === "teacher") {
          navigate("/instructor");
        } else {
          navigate("/");
        }
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        toast({ title: data.message || "Invalid credentials", variant: "destructive" });
      }
    } catch (error) {
      setAuth({ authenticate: false, user: null });
      toast({ title: error?.response?.data?.message || "Login failed", variant: "destructive" });
    }
  }

  //check auth user

  async function checkAuthUser() {
    try {
      const token = sessionStorage.getItem("accessToken");

      // Don't check auth if no token exists
      if (!token) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
        return;
      }

      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        // Clear invalid token
        sessionStorage.removeItem("accessToken");
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      // Clear token on any auth error
      sessionStorage.removeItem("accessToken");
      setAuth({
        authenticate: false,
        user: null,
      });
      setLoading(false);
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  console.log(auth, "gf");

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        setAuth, // <-- Added this line
        resetCredentials,
        isSubmitting,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

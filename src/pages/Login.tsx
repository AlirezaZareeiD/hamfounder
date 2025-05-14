
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { LoginLayout } from "@/components/login/LoginLayout";
import { LoginCard } from "@/components/login/LoginCard";

const Login = () => {
  const navigate = useNavigate();

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        navigate('/dashboard');
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [navigate]);

  return (
    <LoginLayout>
      <LoginCard />
    </LoginLayout>
  );
};

export default Login;

import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { SignUpSocialButtons } from "@/components/SignUpSocialButtons";


// Form schema
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Must be a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .refine(
      (password) => {
        return (
          /[A-Z]/.test(password) && // Has uppercase
          /[a-z]/.test(password) && // Has lowercase
          /[0-9]/.test(password) && // Has number
          /[^A-Za-z0-9]/.test(password) // Has special char
        );
      },
      {
        message:
          "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
      }
    ),
});


interface SignupFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}


export const SignUpForm: React.FC<SignupFormProps> = ({
  isSubmitting,
  setIsSubmitting,
}) => {
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);


  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      setSignupError(null);


      // Create user with email and password using Firebase
      await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );


      // Show success message and reset form
      setSignupSuccess(true);
      form.reset();
    } catch (error: any) {
      // Handle common Firebase Authentication errors
      switch (error.code) {
        case "auth/email-already-in-use":
          setSignupError(
            "This email is already registered. Please sign in."
          );
          break;
        case "auth/weak-password":
          setSignupError(
            "Password is too weak. Please choose a stronger password."
          );
          break;
        case "auth/invalid-email":
          setSignupError(
            "Invalid email address. Please enter a valid email."
          );
          break;
        default:
          setSignupError(
            "Failed to create account. Please try again."
          );
          console.error("Signup error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="mx-auto max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-slate-200">
      <div className="space-y-2 text-center mb-6">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-slate-500">
          Join the community of innovative founders
        </p>
      </div>


      {/* Social Signup Buttons */}
      <div className="mb-6">
        <h3 className="font-medium text-base mb-3">Sign up with</h3>
        <SignUpSocialButtons />
      </div>


      {/* Divider */}
      <div className="relative my-6">
        <Separator />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
          OR CONTINUE WITH
        </span>
      </div>


      {/* Error alert */}
      {signupError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{signupError}</AlertDescription>
        </Alert>
      )}


      {/* Success alert */}
      {signupSuccess && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Account created successfully! You can now sign in.
          </AlertDescription>
        </Alert>
      )}


      {/* Signup Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@company.com"
                    type="email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <PasswordStrengthMeter password={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />


          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create account
          </Button>
        </form>
      </Form>


      <div className="mt-6 text-center text-sm">
        <p className="text-slate-600">
          By using Hamfounder, you agree to our {" "}
          <Link to="/terms" className="underline text-primary hover:text-primary/90">
            Terms of Services
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="underline text-primary hover:text-primary/90"
          >
            Privacy Policy
          </Link>
        </p>
      </div>


      <div className="mt-6 text-center">
        <p className="text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/90">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
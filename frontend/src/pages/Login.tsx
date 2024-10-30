import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { LoginSchema } from "@/schemas/LoginSchema";
import { Button } from "../components/ui/button";
import { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";
import api from "@/utils/axiosInterceptor";

const Login = () => {
  // zod implementation

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  // const { login } = useAuth();

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("password", data.password);
    try {
      const response = await api.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("response", response.data.data);

      if (response.status === 200) {
        const token = response.data.data.accessToken;
        const encryptedtoken = window.btoa(token);
        // console.log("response.data.data.user", response.data.data.user._id);

        const userId = response.data.data.user._id;
        const encryptedUserId = window.btoa(userId);
        // console.log("userId", userId);

        // login(token);
        localStorage.setItem("token", encryptedtoken);
        localStorage.setItem("userId", encryptedUserId);
        toast({
          title: "Login Successful",
          description: response.data.message,
          className: "text-white bg-green-600",
        });
        navigate("/videos");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      console.error("Error while login at frontend", error);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-black text-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Login
          </h1>
          <p className="mb-4">Login and Start Posting/Creating</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-orange-500" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member, Yet?
            <Link to={"/signup"} className="text-blue-800 hover:text-blue-500">
              Sign Up{" "}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

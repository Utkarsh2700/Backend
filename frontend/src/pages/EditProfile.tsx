import {
  CoverImageSchema,
  ImageUpdateSchema,
  PasswordUpdateSchema,
  UserDetailsUpdateSchema,
} from "@/schemas/AvatarUpdateShema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import api from "@/utils/axiosInterceptor";

// const token = localStorage.getItem("token");
const encryptedtoken: string = localStorage.getItem("token") ?? "";
let token: string = atob(encryptedtoken);
// console.log("decryptedToken", token);

const EditProfile = () => {
  return (
    <div className="min-h-screen text-white flex w-full">
      {/* EditProfile */}
      <div className="h-screen overflow-y-auto sticky top-0 scrollbar-hidden w-[250px] flex-shrink-0">
        <Sidebar />
      </div>
      <div className="w-full mx-4">
        <BannerImage></BannerImage>
        <hr className="border-gray-800 my-2" />
        <AvatarUpdate></AvatarUpdate>
        <hr className="border-gray-800 my-2" />
        <UserDetailsUpdate></UserDetailsUpdate>
        <hr className="border-gray-800 my-8" />
        <PasswordUpdate></PasswordUpdate>
        <hr className="my-8" />
      </div>
    </div>
  );
};

export default EditProfile;

const BannerImage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof CoverImageSchema>>({
    resolver: zodResolver(CoverImageSchema),
    // defaultValues: {
    //   coverImage: null,
    // },
  });
  const onSubmit = async (data: z.infer<typeof CoverImageSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("coverImage", data.coverImage);

    try {
      const response = await api.patch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users/coverImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };
  return (
    <div className="w-full">
      <h3 className="mt-2">CoverImage Update</h3>
      <div className="w-full space-y-4">
        <p className="text-sm text-gray-400 w-[40%]">
          This image will appaer on the top when someone visit's your channel
        </p>
        <div className="flex w-[50%]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cursor-pointer">
                      {" "}
                      <ImageUp size={48} />
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="hidden"
                        type="file"
                        placeholder="avatarImage"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            field.onChange(e.target.files[0]);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={!form.formState.isDirty}
                className="w-full text-center"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  "Upload"
                )}
              </Button>
            </form>
          </Form>
          <p>
            It's compulsory to use a Image size of 10 MB or less.Use PNG, JPG
            (no GIF) are allowed.{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

const AvatarUpdate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof ImageUpdateSchema>>({
    resolver: zodResolver(ImageUpdateSchema),
    // defaultValues: {
    //   avatar: null,
    // },
  });
  const onSubmit = async (data: z.infer<typeof ImageUpdateSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("avatar", data.avatar);

    try {
      const response = await api.patch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };
  return (
    <div className="w-full">
      <h3 className="mt-2">Avatar Update</h3>
      <div className="w-full space-y-4">
        <p className="text-sm text-gray-400 w-[40%]">
          This image will serve as your profile picture.On things like next to
          videos, comments.
        </p>
        <div className="flex w-[50%]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cursor-pointer">
                      {" "}
                      <ImageUp size={48} />
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="hidden"
                        type="file"
                        placeholder="avatar"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            field.onChange(e.target.files[0]);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={!form.formState.isDirty || isSubmitting}
                className="w-full text-center"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  "Upload"
                )}
              </Button>
            </form>
          </Form>
          <p>
            It's compulsory to use a picture of the size of below 10 MB.Use PNG,
            JPG (no GIF) are allowed.{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

type userProfileProps = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  subscriberCount: number;
  channelsSubscribedToCount: number;
  isSubscribed: boolean;
  allVideos: string[];
};

const UserDetailsUpdate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState<userProfileProps>();
  const [initialValues, setInitialValues] = useState<userProfileProps>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserDetaills = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await api.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users/current-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const user = response.data.data;
      //   console.log("user", user);

      setUserDetails(user);
      setInitialValues(user); // Set initial values for comparison

      //   setting values initially in inputFields
      form.reset({
        username: user?.username,
        fullName: user?.fullName,
        email: user?.email,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failure",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  console.table(userDetails);
  console.log(isLoading);

  useEffect(() => {
    fetchUserDetaills();
  }, []);
  const form = useForm({
    resolver: zodResolver(UserDetailsUpdateSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
    },
  });

  const getChangedFields = (data: z.infer<typeof UserDetailsUpdateSchema>) => {
    const updatedFields: Record<string, any> = {};
    if (data.username !== initialValues?.username) {
      updatedFields.username = data.username;
    }
    if (data.fullName !== initialValues?.fullName) {
      updatedFields.fullName = data.fullName;
    }
    if (data.email !== initialValues?.email) {
      updatedFields.email = data.email;
    }
    return updatedFields;
  };

  async function onSubmit(data: z.infer<typeof UserDetailsUpdateSchema>) {
    setIsSubmitting(true);
    // Get only changed fields

    const updatedFields = getChangedFields(data);
    // console.log("updatedFields", updatedFields);

    // If no fields have been updated then return

    if (Object.keys(updatedFields).length === 0) {
      toast({
        title: "No Change",
        description: "No fields were updated",
        variant: "info",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.patch(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/users/update-account`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", //Sending data as json
          },
        }
      );
      // console.log("response", response.data);
      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.data.data.message,
          variant: "success",
        });
      }
      fetchUserDetaills();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  }

  return (
    <div>
      <div>
        <p>UserDetails Updation</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormDescription>
                  This is your public display name
                </FormDescription>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FullName</FormLabel>
                <FormDescription>
                  This is your public display FullName
                </FormDescription>
                <FormControl>
                  <Input placeholder="FullName" {...field} />
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
                <FormDescription>
                  This is your public display Email
                </FormDescription>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mb-4"
            disabled={!form.formState.isDirty || isSubmitting}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2" /> : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

const PasswordUpdate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  //   state to keep track of whether the newPass and confPass are matching or not
  const [passwordMatch, setPasswordMatch] = useState(false);
  //   state to keep track of newPass
  const [newPassword, setNewPassword] = useState("");
  //   state to keep track of confPass
  const [confPassword, setConfPassword] = useState("");

  const form = useForm({
    resolver: zodResolver(PasswordUpdateSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confPassword: "",
    },
  });

  //   Effect to check if the newPassword and confPassword match, debounced by 400ms
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (newPassword && confPassword) {
        setPasswordMatch(newPassword === confPassword);
      }
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [newPassword, confPassword]);

  const onSubmit = async (data: z.infer<typeof PasswordUpdateSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("oldPassword", data.oldPassword);
    formData.append("newPassword", data.newPassword);
    formData.append("confPassword", data.confPassword);

    try {
      const response = await api.post(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/users/change-password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.data.data.message || "PSW SCF",
          variant: "success",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <div>
        <h2>Password Change</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Old Password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="New Password"
                      {...field}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      {...field}
                      onChange={(e) => {
                        setConfPassword(e.target.value);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  {!passwordMatch && confPassword.length > 1 && (
                    <p className="text-red-500 text-sm">
                      New Password and Confirm Password do not Match
                    </p>
                  )}
                </FormItem>
              )}
            />
            <Button
              disabled={
                !form.formState.isDirty || !passwordMatch || isSubmitting
              }
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

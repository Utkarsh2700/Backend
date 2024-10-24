import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { TbVideoPlus } from "react-icons/tb";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { videoUploadSchema } from "@/schemas/VideoUploadSchema";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUp, Loader2, UploadCloudIcon } from "lucide-react";

const VideoUpload = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setIsOpen(true);
  }, []);

  // zod implementation
  const form = useForm({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: null,
      videoFile: null,
    },
  });

  const onSubmit = async (data: z.infer<typeof videoUploadSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("thumbnail", data.thumbnail);
    formData.append("videoFile", data.videoFile);

    try {
      const response = await axios.post(`${baseUrl}/videos`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response);

      console.log("response.data", response.data);

      const videoUploaded = response.data;
      toast({
        title: "Success",
        description: videoUploaded.message,
        variant: "success",
      });
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
    <div className="text-white min-h-screen pt-8 px-4">
      <h1>Conditions for hassle free Uploads</h1>
      {/* <div className="sticky top-0 overflow-y-hidden">
        <Sidebar />
      </div> */}
      <div className="modalTrigger">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="flex justify-end items-center">
              <Button
                variant="secondary"
                className="bg-gray-700 text-white hover:bg-neutral-900"
              >
                <TbVideoPlus size={32} />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-[625px] lg:max-w-[925px] lg:min-h-[400px] text-white bg-neutral-800">
            <DialogHeader>
              <DialogTitle>Video Upload</DialogTitle>
              <DialogDescription className="text-white">
                Make sure the video size is strictly below 100MB & Thumbnail
                size is below 10 MB.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <label htmlFor="" className="text-sm font-medium">
                        Thumbanil
                      </label>
                      <FormLabel className="cursor-pointer">
                        <ImageUp size={48} />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="hidden"
                          type="file"
                          placeholder="thumbnail"
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
                <FormField
                  control={form.control}
                  name="videoFile"
                  render={({ field }) => (
                    <FormItem>
                      <label className="font-medium">Video</label>
                      <FormLabel className="cursor-pointer">
                        <UploadCloudIcon size={48} className="rounded-full" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="hidden cursor-pointer"
                          type="file"
                          placeholder="VideoFile"
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
                <Button type="submit" variant="mybtn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Upload"
                  )}
                </Button>
              </form>
            </Form>
            {/* <div className="grid gap-4 py-4">
              <div className="flex justify-center my-6">
                <Label>Video</Label>
                <Button
                  variant={"mybtn"}
                  className="rounded-full w-32 h-32 transition-colors"
                >
                  <MdUpload size={72} />
                </Button>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue="Pedro Duarte"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  defaultValue="@peduarte"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter> */}
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <ul className="list-disc ml-6">
          <li>Make sure the video size is strictly below 100MB</li>
          <li>Make Sure Thumbnail size is below 10 MB</li>
          <li>Title cannot be Empty and less than 4 Characters</li>
          <li>Description cannot be Empty and less than 20 Characters</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoUpload;

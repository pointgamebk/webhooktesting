"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { profileFormSchema } from "@/lib/validator";
import { profileDefaultValues } from "@/constants";

import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "./FileUploader";

import { updateUser } from "@/lib/actions/user.actions";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";

import { IProfile } from "@/lib/database/models/user.model";

type ProfileFormProps = {
  userId: string;
  type: "Create" | "Update";
  user: IProfile;
};

const ProfileForm = ({ userId, type, user }: ProfileFormProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const initialValues =
    user && type === "Update"
      ? {
          profileSchool: user.profileSchool,
          profileContact: user.profileContact,
          profileDescription: user.profileDescription,
          profilePhoto: user.profilePhoto,
        }
      : profileDefaultValues;

  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    let uploadedImageUrl = values.profilePhoto;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }

    try {
      const user = await getUserById(userId);

      const _user = {
        ...user,
        profileSchool: values.profileSchool,
        profileContact: values.profileContact,
        profileDescription: values.profileDescription,
        profilePhoto: uploadedImageUrl,
        profileCompleted: true,
      };

      const path = `/instructor_settings/${userId}`;

      const updatedUser = await updateUser(user.clerkId, _user, path);

      if (updatedUser) {
        form.reset();
        router.push(`/instructor/${userId}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="profileSchool"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Current College or University (optional)"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profileContact"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="
                    Email or preferred contact"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="profileDescription"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea
                    placeholder="Describe yourself and your areas of expertise"
                    {...field}
                    className="textarea rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profilePhoto"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit Update"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;

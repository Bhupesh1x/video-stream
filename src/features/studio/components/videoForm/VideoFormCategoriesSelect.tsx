"use client";

import { z } from "zod";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UseFormReturn } from "react-hook-form";

import { trpc } from "@/trpc/client";
import { updateVideoSchema } from "@/db/schema";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  form: UseFormReturn<z.infer<typeof updateVideoSchema>>;
};

function VideoFormCategoriesSelectSuspense({ form }: Props) {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  return (
    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select
            defaultValue={field.value ?? undefined}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category of your video" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}

function VideoFormCategoriesSelectSkeleton() {
  return (
    <div className="w-full">
      <FormField
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select
              defaultValue={field.value ?? undefined}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category of your video" />
                </SelectTrigger>
              </FormControl>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
}

export function VideoFormCategoriesSelect({ form }: Props) {
  return (
    <Suspense fallback={<VideoFormCategoriesSelectSkeleton />}>
      <ErrorBoundary fallback={<p>Error loading category select</p>}>
        <VideoFormCategoriesSelectSuspense form={form} />
      </ErrorBoundary>
    </Suspense>
  );
}

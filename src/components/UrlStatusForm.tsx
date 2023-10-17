"use client";

import React, { useState, useEffect } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/hooks";
import { fetchURLS } from "@/lib/utils";
import { RotatingLines } from "react-loader-spinner";

import UrlCard from "./UrlCard";

type FormData = {
  id: number;
  url: string;
  fileType: string;
};

const formSchema = z.object({
  url: z.string().refine((url) => url.trim().length > 0, {
    message: "URL cannot be empty.",
  }),
});

export default function UrlStatusForm() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [urlInfo, setUrlInfo] = useState<FormData[] | []>([]);
  const debouncedSearch = useDebounce(search);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
    values: {
      url: search,
    },
  });

  useEffect(() => {
    const loadUrls = async () => {
      setIsLoading(true);

      const urls = await fetchURLS(debouncedSearch);

      setUrlInfo(urls);

      if (debouncedSearch && urls.length === 0) {
        setIsMatch(false);
      } else {
        setIsMatch(true);
      }

      setIsLoading(false);
    };

    loadUrls();
  }, [debouncedSearch]);

  const resetSearchHandler = () => {
    setSearch("");
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSearch(values.url);
  };

  return (
    <Form {...form}>
      <form
        onChange={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full lg:w-[80%] px-5"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter URL</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="https://url.com"
                  {...field}
                  className="cursor-pointer"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <div className="flex flex-wrap justify-center w-full lg:w-[80%] gap-3">
        {isLoading && (
          <RotatingLines
            strokeColor="black"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        )}
        {!isLoading && !isMatch && (
          <p className="text-red-500">No match found for the entered URL.</p>
        )}
        {!isLoading &&
          urlInfo &&
          urlInfo.map((item: FormData) => (
            <UrlCard key={item.id} url={item.url} fileType={item.fileType} />
          ))}
      </div>
      <Button
        onClick={resetSearchHandler}
        className="w-[200px] mt-8 uppercase tracking-widest"
      >
        Reset Search
      </Button>
    </Form>
  );
}

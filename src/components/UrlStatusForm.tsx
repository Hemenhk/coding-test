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
  url: z
    .string()
    .min(1, { message: "Must not be an empty string." })
    .refine(
      (data) => {
        if (data.trim() === "") {
          return false;
        }
        try {
          new URL(data);
          return true;
        } catch (error) {
          return false;
        }
      },
      {
        message: "Invalid URL format. Please enter a valid URL.",
      }
    ),
});

export default function UrlStatusForm() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [urlInfo, setUrlInfo] = useState<FormData[] | []>([]);
  const debouncedSearch = useDebounce(search);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

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
    if (abortController) {
      abortController.abort();
      console.log("Previous request canceled");
    }

    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    const loadUrls = async () => {
      setIsLoading(true);

      try {
        const urls = await fetchURLS(
          debouncedSearch,
          newAbortController.signal
        );

        if (search.trim() === debouncedSearch.trim()) {
          setUrlInfo(urls);

          if (debouncedSearch && urls.length === 0) {
            setIsMatch(false);
          } else {
            setIsMatch(true);
          }
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadUrls();

    return () => {
      newAbortController.abort();
      console.log("New request canceled");
    };
  }, [debouncedSearch]);

  const resetSearchHandler = () => {
    setSearch("");
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (form.formState.isValid) {
      setSearch(values.url);
      console.log(values.url);
    }
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

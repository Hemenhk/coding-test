import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { faker } from "@faker-js/faker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const urls = Array(100)
  .fill(0)
  .map((_, idx) => ({
    id: idx,
    url: faker.internet.url(),
    fileType: Math.random() < 0.5 ? "file" : "folder"
  }));

export const fetchURLS = async (search: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const filteredURLs = urls.filter((url) => url.url.includes(search));

  const formattedURLs = filteredURLs.map((url) => ({
    ...url,
    fileType: url.fileType === "file" ? "file" : "folder",
  }));

  return formattedURLs
};

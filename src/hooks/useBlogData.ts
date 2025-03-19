"use client";
import { useEffect, useState } from "react";
import { Blog } from "@/types/blog";

// Function to transform WordPress data to the desired format
function transformBlogData(blog: any): Blog {
  return {
    id: blog.id,
    title: blog.title.rendered,
    paragraph: blog.excerpt.rendered.replace(/<[^>]+>/g, ""), // Remove HTML tags from excerpt
    image: blog.featured_media
      ? `https://mishkat.webmyway.ca/wp-content/uploads/${blog.featured_media}`
      : "/images/blog/blog-01.jpg", // Use featured media if available
    author: {
      name: "Author Name", // Replace with actual author name if available
      image: "/images/blog/author-01.png", // Replace with actual author image if available
      designation: "Author Designation", // Replace with actual author designation if available
    },
    tags:
      blog.tags.length > 0
        ? blog.tags.map((tag: any) => tag.name)
        : ["creative"], // Use tags if available
    publishDate: new Date(blog.date).getFullYear().toString(), // Extract year from date
  };
}

export default function useBlogData() {
  const [blogData, setBlogData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://mishkat.webmyway.ca/wp-json/wp/v2/posts?per_page=10`,
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        const transformedData = data.map(transformBlogData);
        setBlogData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { blogData, loading, error };
}

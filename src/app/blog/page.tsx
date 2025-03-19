import SingleBlog from "@/components/Blog/SingleBlog";
import blogData from "@/components/Blog/blogData";
import Breadcrumb from "@/components/Common/Breadcrumb";
import useBlogData from "@/hooks/useBlogData";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Page",
  description: "This is Blog Page for Startup",
};

async function getBlogs(page = 1, perPage = 3) {
  const res = await fetch(
    `https://mishkat.webmyway.ca/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

async function getTotalBlogs() {
  const res = await fetch(`https://mishkat.webmyway.ca/wp-json/wp/v2/posts`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.headers.get("X-WP-Total");
}

function transformBlogData(blog: any) {
  return {
    id: blog.id,
    title: blog.title.rendered,
    paragraph: blog.excerpt.rendered
      .replace(/<[^>]+>/g, "")
      .replace(/\[&hellip;\]/g,"...")
      .trim(),
    image: blog.featured_media
      ? `https://mishkat.webmyway.ca/wp-content/uploads/${blog.featured_media}`
      : "/images/blog/blog-01.jpg",
    author: {
      name: "Author Name",
      image: "/images/blog/author-01.png",
      designation: "Author Designation",
    },
    tags:
      blog.tags.length > 0
        ? blog.tags.map((tag: any) => tag.name)
        : ["creative"],
    publishDate: new Date(blog.date).getFullYear().toString(),
  };
}

const Blog = async ({ searchParams }: { searchParams: { page: string } }) => {
  const currentPage = Number(searchParams.page) || 1;
  const blogs = await getBlogs(currentPage);
  const totalBlogs = Number(await getTotalBlogs());
  const totalPages = Math.ceil(totalBlogs / 2);
  const transformedBlogs = blogs.map(transformBlogData);

  return (
    <>
      <Breadcrumb
        pageName="Blogs"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      />

      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {transformedBlogs.map((blog: any) => (
              <div
                key={blog.id}
                className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
              >
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>

          <div className="-mx-4 flex flex-wrap" data-wow-delay=".15s">
            <div className="w-full px-4">
              <ul className="flex items-center justify-center pt-8">
                <li className="mx-1">
                  <a
                    href={`?page=${currentPage - 1}`}
                    className={`flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white ${
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    Prev
                  </a>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li key={page} className="mx-1">
                      <a
                        href={`?page=${page}`}
                        className={`flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white ${
                          currentPage === page
                            ? "bg-primary bg-opacity-100 text-white"
                            : ""
                        }`}
                      >
                        {page}
                      </a>
                    </li>
                  ),
                )}
                <li className="mx-1">
                  <a
                    href={`?page=${currentPage + 1}`}
                    className={`flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white ${
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;

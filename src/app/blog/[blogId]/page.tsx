import Image from "next/image";
import { notFound } from "next/navigation";
import { Blog } from "@/types/blog";

const getBlogById = async (id: string): Promise<Blog | null> => {
  try {
    const res = await fetch(
      `https://mishkat.webmyway.ca/wp-json/wp/v2/posts/${id}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
};
function transformBlogData(blog: any) {
  return {
    id: blog.id,
    title: blog.title.rendered,
    paragraph: blog.content.rendered,
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
    publishDate: new Date(blog.date).toString(),
  };
}

export default async function BlogDetailsPage({ params }: { params: { blogId: string } }) {
  const blog = await getBlogById(params.blogId);
  const transformedBlog = transformBlogData(blog)

  if (!blog) return notFound();

  return (
    <section className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-8/12">
            <div>
              <h2 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                {transformedBlog.title}
              </h2>
              <div className="mb-10 flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
                <div className="flex flex-wrap items-center">
                  <div className="mb-5 mr-10 flex items-center">
                    <div className="mr-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={transformedBlog.author.image}
                          alt={transformedBlog.author.name}
                          fill
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <span className="mb-1 text-base font-medium text-body-color">
                        By <span>{transformedBlog.author.name}</span>
                      </span>
                    </div>
                  </div>
                  <div className="mb-5 flex items-center">
                    <p className="text-base font-medium text-body-color">
                      {transformedBlog.publishDate}
                    </p>
                  </div>
                </div>
              </div>
              {/* <Image
                src={transformedBlog?.image}
                alt={transformedBlog.title}
                width={800}
                height={400}
                className="mb-6 rounded-md"
              /> */}
              <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg">
                <div
                  dangerouslySetInnerHTML={{
                    __html: transformedBlog.paragraph,
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

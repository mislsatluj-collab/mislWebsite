import { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Mission from "@/models/Mission";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mislsatluj.com";

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/media`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const conn = await dbConnect();
    if (conn) {
      // Dynamic blog post routes
      const blogs = await Blog.find({}, "slug publishedAt updatedAt").lean();
      const blogUrls: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
        url: `${baseUrl}/media/${encodeURIComponent(blog.slug)}`,
        lastModified: blog.updatedAt || blog.publishedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));

      // Dynamic mission routes
      const missions = await Mission.find({}, "slug updatedAt").lean();
      const missionUrls: MetadataRoute.Sitemap = missions.map((mission: any) => ({
        url: `${baseUrl}/mission/${encodeURIComponent(mission.slug)}`,
        lastModified: mission.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));

      return [...routes, ...blogUrls, ...missionUrls];
    }
  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
  }

  return routes;
}

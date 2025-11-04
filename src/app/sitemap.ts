import { MetadataRoute } from "next";

// sitemap dla lepszego SEO — bo google lubi takie rzeczy
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://pcstyle.dev",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://pcstyle.dev#projects",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}


import { MetadataRoute } from "next";

// sitemap dla lepszego SEO — bo google lubi takie rzeczy
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pcstyle.dev";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          pl: baseUrl,
          en: baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}#projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          pl: `${baseUrl}#projects`,
          en: `${baseUrl}#projects`,
        },
      },
    },
  ];
}


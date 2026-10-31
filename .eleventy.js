export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "main.js": "main.js" });
  eleventyConfig.addPassthroughCopy({ "files": "files" });
  eleventyConfig.addPassthroughCopy({ "fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "portfolio/files": "portfolio/files" });
  eleventyConfig.addPassthroughCopy({ "expertise/files": "expertise/files" });
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "sitemap.xml": "sitemap.xml" });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk"
  };
}
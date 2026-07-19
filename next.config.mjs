/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site — Netlify just publishes the exported `out/` directory.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;

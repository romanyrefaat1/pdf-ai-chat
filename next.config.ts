import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    HUGGINGFACE_API_TOKEN: process.env.HUGGINGFACE_API_TOKEN,
  },
};

export default nextConfig;

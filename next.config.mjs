/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: "op15swdk",
    NEXT_PUBLIC_SANITY_DATASET: "production",
    SANITY_SECRET_TOKEN: "skfIX2mLZsesL8DxA7UbMKvxgFFCqXNtZWbPKdVawCYbXY24E9q5whUWzJZrHqDOR7WytfWv7n6l5xCLgmQUI43RA7rKzGRRqAbJqUh3x8mWv985ZMaDhb8hIA4SCkSxVqprryd5cXHUomoYA13QA23Sb9ZRZfQdtrNeEHRgojakLfCBn0fD",
  },
};

export default nextConfig;

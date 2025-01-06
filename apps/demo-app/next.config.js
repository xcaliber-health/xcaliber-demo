/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  // distDir: 'build',
  // output: "export",
  images: {
    unoptimized: true
  },

  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false,
  output: 'standalone'
}

module.exports = nextConfig

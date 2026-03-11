/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.optimization.splitChunks = {
      ...config.optimization.splitChunks,
      cacheGroups: {
        ...(config.optimization.splitChunks?.cacheGroups || {}),
        three: {
          test: /[\\/]node_modules[\\/]three[\\/]/,
          name: "three",
          chunks: "all",
          priority: 10,
        },
      },
    };
    return config;
  },
};
export default nextConfig;

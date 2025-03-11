import { NextConfig } from 'next';

const nextConfig = {
  output: 'standalone',
  experimental: {
      serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
};

module.exports = nextConfig
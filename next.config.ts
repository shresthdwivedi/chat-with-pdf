import { NextConfig } from 'next';

const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['sharp', 'onnxruntime-node'],

};

module.exports = nextConfig
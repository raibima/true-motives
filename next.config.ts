import {withWorkflow} from 'workflow/next';
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  logging: {
    browserToTerminal: true,
  },
};

export default withWorkflow(nextConfig);

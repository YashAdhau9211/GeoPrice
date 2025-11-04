import * as dotenv from 'dotenv';
dotenv.config();

export interface EnvironmentConfig {
  PORT: number;
  MONGODB_URI: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  EXCHANGE_API_KEY: string;
  BASE_URL: string;
  FRONTEND_URL: string;
  NODE_ENV: string;
}

export const config: EnvironmentConfig = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  EXCHANGE_API_KEY: process.env.EXCHANGE_API_KEY || '',
  BASE_URL: process.env.BASE_URL || '',
  FRONTEND_URL: (process.env.FRONTEND_URL || '').replace(/^["']|["']$/g, ''),
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export const validateEnvironment = (): void => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'EXCHANGE_API_KEY',
    'BASE_URL',
    'FRONTEND_URL',
  ];

  const missingVars: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.error(
      `ERROR: Missing required environment variables: ${missingVars.join(', ')}`
    );
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }

  console.log('Environment variables validated successfully');
};

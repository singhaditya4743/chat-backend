import { createApp } from '@/app';
import { env } from '@/config/env';
import { connectServices, disconnectServices } from '@/config/connections';

const start = async (): Promise<void> => {
  await connectServices();

  const server = createApp().listen(env.port, () => {
    console.log(`Server running on http://localhost:${String(env.port)} (${env.nodeEnv})`);
  });

  const shutdown = (): void => {
    server.close(() => {
      void disconnectServices().finally(() => process.exit(0));
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

start().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

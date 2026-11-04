import type { PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: PropsWithChildren) {
  return <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Daymark is a cozy, local-first habit tracker." />
      <link rel="icon" type="image/svg+xml" href="/daymark.svg" />
      <ScrollViewStyleReset />
    </head>
    <body>{children}</body>
  </html>;
}

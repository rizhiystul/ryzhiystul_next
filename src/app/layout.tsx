import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "РыжийСтул"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

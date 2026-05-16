import type { Metadata } from "next";
import { Style_Provider } from "@ryzhiy_ui/next";

export const metadata: Metadata = {
  title: "RyzhiyStul"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Style_Provider>
          {children}
        </Style_Provider>
      </body>
    </html>
  );
}

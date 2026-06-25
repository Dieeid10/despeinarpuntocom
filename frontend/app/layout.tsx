import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`antialiased`}>
      <body>
          {children}
      </body>
    </html>
  );
}

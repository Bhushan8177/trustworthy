import "./globals.css";

export const metadata: {
  title: string;
  description: string;
} = {
  title: "Trustworthy",
  description: "Next Gen Cab Booking System", 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  );
}

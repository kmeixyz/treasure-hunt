import './globals.css';

export const metadata = {
  title: 'Treasure Hunt — Algorithm Adventure',
  description: 'A tiny game about finding treasure, learning algorithms, and getting better with every guess.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-row items-center justify-between">
          <Logo />
          <p className="text-gray-600 text-sm">
            © 2024 Zsar Zsar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">
                Server Dashboard
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" asChild>
              <Link href="/">Logout</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

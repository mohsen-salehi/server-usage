import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "Server Dashboard",
  description: "Monitor your Linux server resources",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}

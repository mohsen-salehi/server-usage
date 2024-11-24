import { ResourceChart } from "@/components/resource-chart";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ResourceChart title="System Resources" resourceType="system" />
      <ResourceChart title="Nginx Usage" resourceType="nginx" />
      <ResourceChart title="PHP-FPM Usage" resourceType="fpm" />
      <ResourceChart title="Redis Usage" resourceType="redis" />
      <ResourceChart title="MySQL Usage" resourceType="mysql" />
    </div>
  );
}

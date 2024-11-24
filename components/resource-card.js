"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

async function getResourceUsage(resourceType) {
  const response = await fetch(`/api/resource-usage?type=${resourceType}`);
  if (!response.ok) {
    throw new Error("Failed to fetch resource usage");
  }
  const data = await response.json();
  return data.usage;
}

export function ResourceCard({ title, resourceType }) {
  const [usage, setUsage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const data = await getResourceUsage(resourceType);
        setUsage(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchUsage();
    const interval = setInterval(fetchUsage, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [resourceType]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <div className="text-2xl font-bold mb-2">{usage.toFixed(2)}%</div>
            <Progress value={usage} className="w-full" />
          </>
        )}
      </CardContent>
    </Card>
  );
}

'use client'

import { useState, useEffect } from 'react'
import { LineChartComponent } from './line-chart'
import { PieChartComponent } from './pie-chart'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

async function getResourceUsage(resourceType) {
  try {
    const response = await fetch(`/api/resource-usage?type=${resourceType}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch resource usage');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching resource usage:', error);
    throw error;
  }
}

export function ResourceChart({ title, resourceType }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await getResourceUsage(resourceType);
        setData(prevData => {
          const timestamp = new Date().toLocaleTimeString();
          const newEntry = { timestamp, ...newData };
          return [...prevData.slice(-19), newEntry].slice(-20);
        });
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching resource usage:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [resourceType]);

  if (error) {
    return (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  if (resourceType === 'system') {
    return (
        <>
          <PieChartComponent title="CPU Usage" data={data[data.length - 1]?.cpu} isLoading={isLoading} error={error} />
          <PieChartComponent title="RAM Usage" data={data[data.length - 1]?.ram} isLoading={isLoading} error={error} />
          <LineChartComponent title="RAM Usage" data={data} dataKey="ram" isLoading={isLoading} error={error} />
          <LineChartComponent title="Disk Usage" data={data} dataKey="disk" isLoading={isLoading} error={error} />
        </>
    );
  } else {
    return (
        <LineChartComponent title={title} data={data} dataKey="usage" isLoading={isLoading} error={error} />
    );
  }
}

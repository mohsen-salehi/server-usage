'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Loader2 } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function PieChartComponent({ title, data, isLoading, error }) {
    const chartData = [
        { name: 'Used', value: parseFloat(data) },
        { name: 'Free', value: 100 - parseFloat(data) }
    ];

    return (
        <Card className="w-full h-[300px]">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-60px)]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}


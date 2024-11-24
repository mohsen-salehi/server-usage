'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function LineChartComponent({ title, data, dataKey, isLoading, error }) {
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
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timestamp" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey={dataKey} stroke="#8884d8" name="Usage" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}


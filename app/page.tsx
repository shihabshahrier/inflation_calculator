"use client";

import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [endYear, setEndYear] = useState(new Date().getFullYear() + 10);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const calculateAdjustedIncome = () => {
    const years = endYear - startYear + 1;
    const data = [];

    for (let i = 0; i < years; i++) {
      const year = startYear + i;
      const inflationMultiplier = Math.pow(1 + inflationRate / 100, i);
      const adjustedMonthlyIncome = monthlyIncome * inflationMultiplier;
      const currentYearlyIncome = monthlyIncome * 12;
      const adjustedYearlyIncome = adjustedMonthlyIncome * 12;

      data.push({
        year,
        "Current Income": Math.round(currentYearlyIncome),
        "Inflation-Adjusted Income": Math.round(adjustedYearlyIncome),
      });
    }

    return data;
  };

  const chartData = calculateAdjustedIncome();

  const axisStyle = {
    stroke: isDarkMode ? "#fff" : "#000",
    fontSize: 12,
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Inflation Income Calculator
            </h1>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-6 shadow-lg">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="startYear">Start Year</Label>
                  <Input
                    id="startYear"
                    type="number"
                    value={startYear}
                    onChange={(e) => setStartYear(Number(e.target.value))}
                    min={1900}
                    max={9999}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endYear">End Year</Label>
                  <Input
                    id="endYear"
                    type="number"
                    value={endYear}
                    onChange={(e) => setEndYear(Number(e.target.value))}
                    min={startYear}
                    max={9999}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="inflationRate">
                    Inflation Rate (% per year)
                  </Label>
                  <Input
                    id="inflationRate"
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    step="0.1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="monthlyIncome">Monthly Income (BDT)</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-12">
            <Card className="p-6 shadow-lg overflow-x-auto max-w-full">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Year</th>
                    <th className="text-right p-2">Current Income</th>
                    <th className="text-right p-2">Inflation-Adjusted Income</th>
                    <th className="text-right p-2">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((data) => (
                    <tr key={data.year} className="border-b">
                      <td className="p-2">{data.year}</td>
                      <td className="text-right p-2">
                        BDT {new Intl.NumberFormat().format(data["Current Income"])}
                      </td>
                      <td className="text-right p-2 text-green-600 dark:text-green-400">
                        BDT {new Intl.NumberFormat().format(
                          data["Inflation-Adjusted Income"]
                        )}
                      </td>
                      <td className="text-right p-2 text-red-600 dark:text-red-400">
                        +BDT {new Intl.NumberFormat().format(
                          data["Inflation-Adjusted Income"] -
                            data["Current Income"]
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card className="m-1 p-1 shadow-lg">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 40, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      {...axisStyle}
                      dataKey="year"
                      height={60}
                      tickLine={true}
                      axisLine={true}
                      padding={{ left: 0, right: 0 }}
                      allowDecimals={false}
                      minTickGap={0}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      {...axisStyle}
                      tickLine={true}
                      axisLine={true}
                      width={80}
                      padding={{ top: 0, bottom: 0 }}
                      tickFormatter={(value) => `BDT ${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                        border: "none",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      formatter={(value) =>
                        `BDT ${new Intl.NumberFormat().format(Number(value))}`
                      }
                    />
                    
                    <Legend verticalAlign="bottom" height={36} />
                    <Line
                      type="monotone"
                      dataKey="Current Income"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Inflation-Adjusted Income"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
            
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
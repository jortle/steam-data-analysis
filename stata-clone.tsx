"use client"

import { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data
const initialData = [
  { id: 1, age: 25, income: 30000, education: 16 },
  { id: 2, age: 30, income: 45000, education: 18 },
  { id: 3, age: 35, income: 55000, education: 20 },
  { id: 4, age: 40, income: 70000, education: 22 },
  { id: 5, age: 45, income: 80000, education: 19 },
]

export default function StataClone() {
  const [data, setData] = useState(initialData)
  const [output, setOutput] = useState("")
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check for user's preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true)
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real application, you'd parse the file here
      setOutput("File uploaded: " + file.name)
    }
  }

  const generateBarChart = () => {
    setOutput((prevOutput) => prevOutput + "\n\nGenerating bar chart...")
    setTimeout(() => {
      setOutput((prevOutput) => prevOutput + "\n" + renderChart())
    }, 100)
  }

  const calculateMean = () => {
    const mean = data.reduce((sum, item) => sum + item.income, 0) / data.length
    setOutput((prevOutput) => prevOutput + `\n\nMean income: $${mean.toFixed(2)}`)
  }

  const calculateMedian = () => {
    const sortedIncomes = data.map((item) => item.income).sort((a, b) => a - b)
    const mid = Math.floor(sortedIncomes.length / 2)
    const median =
      sortedIncomes.length % 2 !== 0 ? sortedIncomes[mid] : (sortedIncomes[mid - 1] + sortedIncomes[mid]) / 2
    setOutput((prevOutput) => prevOutput + `\n\nMedian income: $${median.toFixed(2)}`)
  }

  const renderChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill={darkMode ? "#8884d8" : "#82ca9d"} />
          <Bar dataKey="education" fill={darkMode ? "#82ca9d" : "#8884d8"} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className={`container mx-auto p-4 ${darkMode ? "dark" : ""}`}>
      <div
        className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen transition-colors duration-200`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Stata Clone</h1>
          <Button onClick={toggleDarkMode}>{darkMode ? "Light Mode" : "Dark Mode"}</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`col-span-1 md:col-span-2 ${darkMode ? "bg-gray-800 text-white" : ""}`}>
            <CardHeader>
              <CardTitle>Data and Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="data">
                <TabsList>
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="graphs">Graphs</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>
                <TabsContent value="data">
                  <div className="mb-4">
                    <Input type="file" onChange={handleFileUpload} />
                  </div>
                  <Textarea
                    value={JSON.stringify(data, null, 2)}
                    readOnly
                    className={`w-full h-64 ${darkMode ? "bg-gray-700 text-white" : ""}`}
                  />
                </TabsContent>
                <TabsContent value="graphs">
                  <Button onClick={generateBarChart}>Generate Bar Chart</Button>
                </TabsContent>
                <TabsContent value="stats">
                  <div className="space-x-2">
                    <Button onClick={calculateMean}>Calculate Mean</Button>
                    <Button onClick={calculateMedian}>Calculate Median</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card className={`${darkMode ? "bg-gray-800 text-white" : ""}`}>
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                className={`w-full h-64 mb-4 ${darkMode ? "bg-gray-700 text-white" : ""}`}
              />
              {output.includes("Generating bar chart") && renderChart()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


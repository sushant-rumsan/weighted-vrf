"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const mockEmployees = [
  { id: 1, name: "Alice Johnson", probability: 25, daysSinceLastPaid: 3 },
  { id: 2, name: "Bob Smith", probability: 0, daysSinceLastPaid: 0 },
  { id: 3, name: "Carol Davis", probability: 35, daysSinceLastPaid: 5 },
  { id: 4, name: "David Wilson", probability: 40, daysSinceLastPaid: 7 },
]

export default function ProbabilityPage() {
  const [employees] = useState(mockEmployees)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-red-300 hover:text-white mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">🎯 Current Odds</h1>
        </div>

        <div className="space-y-3">
          {employees.map((employee) => (
            <Card key={employee.id} className="bg-black/50 border-red-500/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium">{employee.name}</div>
                    <div className="text-red-300 text-sm">{employee.daysSinceLastPaid} days since last paid</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">{employee.probability}%</div>
                    <div className="text-red-200 text-xs">chance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

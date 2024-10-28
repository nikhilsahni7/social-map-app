"use client"

import React, { useState } from 'react'
import { Calendar, MapPin, PlusCircle, Scroll } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SupportItem {
  name: string
  quantity: number
  units: string
  type: string
  customType: string
}

export default function ProjectDetailsForm() {
  const [supportItems, setSupportItems] = useState<SupportItem[]>([
    { name: "", quantity: 0, units: "", type: "", customType: "" },
    { name: "", quantity: 0, units: "", type: "", customType: "" },
  ])

  const handleItemChange = (index: number, field: keyof SupportItem, value: string | number) => {
    const updatedItems = [...supportItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setSupportItems(updatedItems)
  }

  const handleAddMore = () => {
    setSupportItems([...supportItems, { name: "", quantity: 0, units: "", type: "", customType: "" }])
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 overflow-hidden">
      <div className="h-full w-full p-4">
        <Card className="h-full border-4 border-blue-200 rounded-lg shadow-lg overflow-hidden">
          <ScrollArea className="h-full">
            <CardContent className="h-full p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-left">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    <label className="text-md font-semibold text-blue-600">Project Creator Name:</label>
                    <Input placeholder="Enter your name" className="w-full md:w-2/3" />
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-blue-600 mb-2">Project Title/Objective</h3>
                  <ScrollArea className="h-[65px]">
                    <div className="w-full border border-gray-300 rounded-md">
                      <Textarea
                        placeholder="Enter project details..."
                        className="w-full h-8 border border-gray-300 rounded-md"
                      />
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                  <label className="text-md font-semibold text-blue-600">Project Tag Preview:</label>
                  <h1 className="text-sm font-normal">Mr. XXX wants to</h1>
                  <Input placeholder="" className="w-full md:w-1/3" />
                </div>

                <div>
                  <h3 className="text-md font-semibold text-blue-600 mb-2">Project Details</h3>
                  <ScrollArea className="h-[65px]">
                    <div className="w-full border border-gray-300 rounded-md">
                      <Textarea
                        placeholder="Enter project details..."
                        className="w-full h-8 border border-gray-300 rounded-md"
                      />
                    </div>
                  </ScrollArea>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-md font-semibold text-blue-600">
                    Category
                  </Label>
                  <Select>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIDA">HIDA</SelectItem>
                      <SelectItem value="NGO">NGO</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                      <SelectItem value="Educational">Educational Institution</SelectItem>
                      <SelectItem value="Startup">Startup</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-blue-600 mb-2">Location</h3>
                  <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 w-full">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <Input
                      placeholder="Enter location"
                      className="border-none bg-transparent p-0 focus-visible:ring-0 w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold text-blue-600 mb-2">Support Needed</h3>
                  <ScrollArea className="h-[180px] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {supportItems.map((item, index) => (
                        <Card key={index} className="p-2">
                          <Input
                            placeholder="Item name"
                            className="font-medium text-sm mb-1"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                          />
                          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                            <Input
                              type="number"
                              placeholder="Quantity"
                              className="text-xs w-20"
                              value={item.quantity || ""}
                              onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                            />
                            <Input
                              placeholder="Units"
                              className="text-xs flex-1"
                              value={item.units}
                              onChange={(e) => handleItemChange(index, "units", e.target.value)}
                            />
                          </div>
                          <Select
                            value={item.type}
                            onValueChange={(value) => {
                              handleItemChange(index, "type", value)
                            }}
                          >
                            <SelectTrigger className="mt-1 text-xs">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Volunteers">Volunteers</SelectItem>
                              <SelectItem value="Items">Items</SelectItem>
                              <SelectItem value="Funds">Funds</SelectItem>
                              <SelectItem value="Services">Services</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {item.type && (
                            <Input
                              placeholder={`Specify ${item.type.toLowerCase()}`}
                              className="mt-1 text-xs"
                              value={item.customType || ""}
                              onChange={(e) => handleItemChange(index, "customType", e.target.value)}
                            />
                          )}
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                  <Button
                    onClick={handleAddMore}
                    variant="outline"
                    className="mt-2 w-full flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add More Support Items
                  </Button>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-blue-600 mb-2">Additional Information</h3>
                  <Textarea
                    placeholder="Enter any additional information..."
                    className="w-full h-32"
                  />
                </div>

                <Button className="w-full">Submit</Button>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}

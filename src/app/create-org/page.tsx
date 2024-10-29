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
  const [supportItems, setSupportItems] = useState<{ [key: string]: boolean }[]>([
    { item: false, other: false, by: false, prop: false }, // First row
    { item: false, other: false, by: false, prop: false }, // Second row
  ]);

  // State for handling "Other" input
  const [otherInput, setOtherInput] = useState<string>("");

  // Function to handle checkbox change
  const handleCheckboxChange = (rowIndex: number, checkbox: keyof typeof supportItems[0]) => {
    setSupportItems((prev) => {
      const newItems = [...prev];
      newItems[rowIndex][checkbox] = !newItems[rowIndex][checkbox]; // Toggle checkbox state
      return newItems;
    });
  };

  // Function to add a new row
  const handleAddRow = () => {
    setSupportItems((prev) => [...prev, { item: false, other: false, by: false, prop: false }]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white text-gray-900 overflow-hidden">
      <div className="w-full max-w-2xl p-4">
        <Card className="border-4 border-blue-200 rounded-lg shadow-lg overflow-hidden">
          <ScrollArea className="h-full">
            <CardContent className="p-4 grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="text-left">
                  <div className="flex flex-col items-start space-y-2">
                    <label className="text-md font-semibold text-blue-600">Project Creator Name:</label>
                    <Input placeholder="Enter your name" className="w-full" />
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

                <div className="flex flex-col items-start space-y-2">
                  <label className="text-md font-semibold text-blue-600">Project Tag Preview:</label>
                  <div className="flex space-x-4 items-center">
                    <h1 className="text-sm font-medium">Mr. XXX wants to</h1>
                    <Input placeholder="" className="w-44" />
                  </div>
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

                <div className="flex flex-col space-y-4">
                  {/* Category, Duration, and Photo on the same line for larger screens, column-wise for mobile */}
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-10 items-center">
                    {/* Category Section */}
                    <div className="flex flex-col space-y-2 w-full md:w-1/4">
                      <Label htmlFor="category" className="text-md font-semibold text-blue-600">
                        Category
                      </Label>
                      <Select>
                        <SelectTrigger id="category" className="w-full md:w-40">
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

                    {/* Duration Section */}
                    <div className="flex flex-col space-y-2 w-full md:w-1/4">
                      <Label htmlFor="duration" className="text-md font-semibold text-blue-600">
                        Duration
                      </Label>
                      <div className="flex space-x-2">
                        <input
                          type="date"
                          id="fromDate"
                          name="fromDate"
                          className="w-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200 text-sm"
                        />
                        <span className="text-md font-semibold text-black">to</span>
                        <input
                          type="date"
                          id="toDate"
                          name="toDate"
                          className="w-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200 text-sm"
                        />
                      </div>
                    </div>

                    {/* Photo Section */}
                    <div className="flex flex-col space-y-2 w-full md:w-1/4">
                      <Label htmlFor="photo" className="text-md font-semibold text-blue-600">
                        Photo
                      </Label>
                      <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                </div>



                <div>
                  {/* Title */}
                  <h3 className="text-md font-semibold text-blue-600 mb-4">Support Needed</h3>

                  {/* Support Item Rows */}
                  {supportItems.map((support, index) => (
                    <div key={index} className="flex items-center space-x-4 mb-2 p-2 border rounded-md">
                      {/* Checkbox for Item */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`supportItem-${index}`}
                          checked={support.item}
                          onChange={() => handleCheckboxChange(index, "item")}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`supportItem-${index}`} className="text-sm font-medium text-gray-700">
                          Item
                        </label>
                      </div>

                      {/* Checkbox for Other */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`supportOther-${index}`}
                          checked={support.other}
                          onChange={() => handleCheckboxChange(index, "other")}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`supportOther-${index}`} className="text-sm font-medium text-gray-700">
                          Other
                        </label>
                      </div>

                      {/* Checkbox for By */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`supportBy-${index}`}
                          checked={support.by}
                          onChange={() => handleCheckboxChange(index, "by")}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`supportBy-${index}`} className="text-sm font-medium text-gray-700">
                          By
                        </label>
                      </div>

                      {/* Checkbox for Prop */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`supportProp-${index}`}
                          checked={support.prop}
                          onChange={() => handleCheckboxChange(index, "prop")}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`supportProp-${index}`} className="text-sm font-medium text-gray-700">
                          Prop
                        </label>
                      </div>
                    </div>
                  ))}

                  {/* Add More Button */}
                  <Button onClick={handleAddRow} className="mt-4 flex items-center space-x-2">
                    <PlusCircle size={18} />
                    <span>Add More</span>
                  </Button>
                  <div className="mt-2 p-2 rounded-md">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                      {/* Other Input */}
                      <div className="flex items-center space-x-2">
                        <label htmlFor="otherInput" className="text-sm font-medium text-gray-700">
                          Other:
                        </label>
                        <input
                          type="text"
                          id="otherInput"
                          value={otherInput}
                          onChange={(e) => setOtherInput(e.target.value)}
                          placeholder="Specify other support"
                          className="p-2 border h-8 w-44 border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Completed by creator */}
                      <div className="text-sm font-medium text-black">
                        Completed by creator
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Submit
                    </button>
                  </div>


                </div>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
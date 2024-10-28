"use client"

import React, { useState } from 'react'
import { Calendar, MapPin, PlusCircle, Scroll } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ProjectDetailsForm() {
  const [supportItems, setSupportItems] = useState([{}, {}])

  const handleAddMore = () => {
    setSupportItems([...supportItems, {}])
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 overflow-hidden">
      <div className="h-full w-full p-4">
        <Card className="h-full border-4 border-blue-200 rounded-lg shadow-lg overflow-hidden">
          <CardContent className="h-full p-4 grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="text-left">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Name:</label>
                  <Input placeholder="Enter your name" className="w-full" />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Project Duration</h3>
                <div className="flex justify-between text-sm gap-4">
                  <div className="w-full">
                    <p className="font-semibold mb-1">Start:</p>
                    <Input type="date" className="w-full" />
                  </div>
                  <div className="w-full">
                    <p className="font-semibold mb-1">End:</p>
                    <Input type="date" className="w-full" />
                  </div>
                </div>
              </div>


              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Project Details</h3>
                <ScrollArea className="h-[65px]">
                  <div className="w-full border border-gray-300 rounded-md">
                    <Textarea
                      placeholder="Enter project details..."
                      className="w-full h-8 border border-gray-300 rounded-md"
                    />
                  </div>
                </ScrollArea>
              </div>




              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Location</h3>
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 w-full">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <Input
                    placeholder="Enter location"
                    className="border-none bg-transparent p-0 focus-visible:ring-0"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Deadline</h3>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <Input
                    type="date"
                    className="flex-1 border-none bg-transparent focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Support Needed</h3>
                <ScrollArea className="h-[180px] pr-4">
                  <div className="grid grid-cols-2 gap-2">
                    {supportItems.map((_, index) => (
                      <Card key={index} className="p-2">
                        <Input
                          placeholder="Item name"
                          className="font-medium text-sm mb-1"
                        />
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            placeholder="Quantity"
                            className="text-xs w-20"
                          />
                          <Input
                            placeholder="Units"
                            className="text-xs flex-1"
                          />
                        </div>
                        <Input
                          placeholder="Type (e.g., Volunteers, Items)"
                          className="mt-1 text-xs"
                        />
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Additional Information</h3>
                <Textarea
                  placeholder="Enter any additional information..."
                  className="w-full h-32"
                />
              </div>

              <Button className="w-full">Submit</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
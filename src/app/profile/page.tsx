"use client"

import React, { useRef } from "react"
import { MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import html2canvas from "html2canvas"
import { ScrollArea } from '@/components/ui/scroll-area'

const ProjectDetails: React.FC = () => {
  const projectDetailsRef = useRef<HTMLDivElement>(null)

  const handleDownloadScreenshot = async () => {
    if (projectDetailsRef.current) {
      try {
        const canvas = await html2canvas(projectDetailsRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
        })
        const image = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = image
        link.download = "Innovative_Map_Project_details.png"
        link.click()
      } catch (error) {
        console.error("Error generating screenshot:", error)
      }
    }
  }

  // Hard-coded data
  const creator = "John Doe"
  const details = "This project is focused on creating an interactive map platform that helps users navigate and explore different regions. Our goal is to provide a user-friendly interface that combines detailed geographical data with real-time information, making it easier for people to discover and learn about various locations around the world."
  const supportNeeded = [
    { id: "1", name: "Volunteers", quantity: 5, units: "", type: "Volunteers" },
    { id: "2", name: "Laptops", quantity: 3, units: "", type: "Items" },
    { id: "3", name: "Office Space", quantity: 500, units: "sqft", type: "Other" },
    { id: "4", name: "Funding", quantity: 10000, units: "USD", type: "Financial" },
  ]
  const location = "San Francisco, CA"
  const others = "For more information about this project or to discuss potential collaborations, please don't hesitate to reach out to the project creator. We're always open to new ideas and partnerships that can help us improve and expand our platform."

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 overflow-hidden">
      <div className="h-full w-full p-4" ref={projectDetailsRef}>
        <Card className="h-full border-4 border-blue-200 rounded-lg shadow-lg overflow-hidden">
          <CardContent className="h-full p-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Section: Project Details and Asmi's Support */}
            <div className="space-y-4">
              {/* Project Creator Name */}
              <div className="text-left flex flex-row items-center space-x-2">
                <label className="text-md font-semibold text-blue-600">Project Creator Name:</label>
                <h2 className="text-xl font-semibold">{creator}</h2>
              </div>

              {/* Project Tag Preview */}
              <div className="flex flex-row items-center space-x-2">
                <label className="text-md font-semibold text-blue-600">Project Tag Preview:</label>
                <h1 className="text-sm font-normal">Mr. XXX wants to support Organization Name</h1>
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-md font-semibold text-blue-600 mb-2">Project Details</h3>
                <ScrollArea className="h-[100px]">
                  <p className="text-sm text-gray-700 leading-tight">{details}</p>
                </ScrollArea>
              </div>

              {/* Asmi Support Section */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">Asmi wants to support {creator} by giving:</h3>
                <ScrollArea className="h-[170px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {supportNeeded.map((item) => (
                      <Card key={item.id} className="p-2">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Quantity: {item.quantity} {item.units}
                        </p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {item.type}
                        </Badge>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Location</h3>
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{location}</span>
                </div>
              </div>
            </div>

            {/* Right Section: Additional Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Additional Information</h3>
                <ScrollArea className="h-[100px]">
                  <p className="text-sm text-gray-700 leading-tight">{others}</p>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProjectDetails

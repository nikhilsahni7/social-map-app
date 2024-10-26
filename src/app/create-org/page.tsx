"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import {
  Calendar,
  User,
  Tag as TagIcon,
  Download,
  Plus,
  Check,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import html2canvas from "html2canvas"

interface SupportItem {
  id: string
  name: string
  quantity: number
  units: string
  type: string
}

const supportTypes = [
  "Items",
  "Medical Support",
  "Financial Support",
  "Volunteers",
  "Other",
]

export default function CreateProjectDetails() {
  const [formData, setFormData] = useState({
    creator: "",
    title: "",
    preview: "/placeholder.svg?height=400&width=800",
    details: "",
    category: "",
    photoCaption: "",
    others: "",
  })
  const [supportItems, setSupportItems] = useState<SupportItem[]>([])
  const [newItemName, setNewItemName] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState(1)
  const [newItemType, setNewItemType] = useState(supportTypes[0])
  const [newItemUnits, setNewItemUnits] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const projectDetailsRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSupportItem = () => {
    if (newItemName && newItemQuantity > 0) {
      setSupportItems([
        ...supportItems,
        {
          id: Date.now().toString(),
          name: newItemName,
          quantity: newItemQuantity,
          units: newItemUnits,
          type: newItemType,
        },
      ])
      setNewItemName("")
      setNewItemQuantity(1)
      setNewItemUnits("")
      setNewItemType(supportTypes[0])
    }
  }

  const handleDownloadPDF = async () => {
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
        link.download = `${formData.title.replace(/\s+/g, "_")}_project_details.png`
        link.click()
      } catch (error) {
        console.error("Error generating screenshot:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      <div className="max-w-4xl mx-auto p-6" ref={projectDetailsRef}>
        <Card className="border-4 border-blue-200 rounded-lg shadow-lg overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <Input
                name="creator"
                placeholder="Enter project creator name"
                value={formData.creator}
                onChange={handleInputChange}
                className="text-2xl font-semibold mb-2 text-center"
              />
              <p className="text-gray-600">Project Creator</p>
            </div>

            <Separator className="my-8" />

            <div className="mb-8">
              <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={formData.preview}
                  alt={`${formData.title} Preview`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <Input
                name="photoCaption"
                placeholder="Enter photo caption"
                value={formData.photoCaption}
                onChange={handleInputChange}
                className="text-sm text-gray-500 mt-2 text-center"
              />
              <div className="mt-4">
                <Label htmlFor="preview-upload">Upload Preview Image</Label>
                <Input
                  id="preview-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setFormData(prev => ({ ...prev, preview: reader.result as string }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <Input
                name="category"
                placeholder="Enter project category"
                value={formData.category}
                onChange={handleInputChange}
                className="text-lg py-1 px-3"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Project Duration</h3>
              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-auto">
                  <Label htmlFor="start-date" className="mb-2 block">Start Date</Label>
                  <DatePicker
                    selected={startDate}
                    onSelect={setStartDate}
                    customInput={
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a start date"}
                      </Button>
                    }
                  />
                </div>
                <div className="w-full md:w-auto mt-4 md:mt-0">
                  <Label htmlFor="end-date" className="mb-2 block">End Date</Label>
                  <DatePicker
                    selected={endDate}
                    onSelect={setEndDate}
                    customInput={
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick an end date"}
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Project Details</h3>
              <Textarea
                name="details"
                placeholder="Enter project details"
                value={formData.details}
                onChange={handleInputChange}
                className="w-full h-32"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Support Needed</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {supportItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity} {item.units}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {item.type}
                    </Badge>
                  </Card>
                ))}
              </div>
              <Card className="p-4">
                <h4 className="font-semibold text-2xl mb-2">Add New Support Item</h4>
                <div className="space-y-2">
                  <Select value={newItemType} onValueChange={setNewItemType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select support type" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Support item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={newItemQuantity}
                      onChange={(e) => setNewItemQuantity(parseInt(e.target.value))}
                      min={1}
                      className="w-1/2"
                    />
                    <Input
                      placeholder="Units"
                      value={newItemUnits}
                      onChange={(e) => setNewItemUnits(e.target.value)}
                      className="w-1/2"
                    />
                  </div>
                  <Button onClick={handleAddSupportItem} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Support Item
                  </Button>
                </div>
              </Card>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Additional Information</h3>
              <Textarea
                name="others"
                placeholder="Enter additional information"
                value={formData.others}
                onChange={handleInputChange}
                className="w-full h-32"
              />
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}
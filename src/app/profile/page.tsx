"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import {
  Calendar,
  User,
  Tag as TagIcon,
  Download,
  ThumbsUp,
  ThumbsDown,
  Send,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import html2canvas from "html2canvas"

interface SupportItem {
  id: string
  name: string
  quantity: number
  units: string
  type: string
}

interface ProjectDetailsProps {
  creator: string
  title: string
  preview: string
  details: string
  category: string
  photoCaption: string
  others: string
  supportNeeded: SupportItem[]
  location: string
  deadline: Date
  startDate: Date
  endDate: Date
}

function CommentSection() {
  const [comments, setComments] = useState([
    {
      id: "1",
      user: "Alice Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "This project looks amazing! I'd love to contribute as a volunteer.",
      likes: 15,
      dislikes: 2,
      timestamp: new Date(2023, 5, 15, 10, 30),
    },
    {
      id: "2",
      user: "Bob Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Great initiative! How can I donate some laptops?",
      likes: 8,
      dislikes: 0,
      timestamp: new Date(2023, 5, 16, 14, 45),
    },
  ])
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        user: "Current User",
        avatar: "/placeholder.svg?height=40&width=40",
        content: newComment,
        likes: 0,
        dislikes: 0,
        timestamp: new Date(),
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-blue-600 mb-4">Comments</h3>
      <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <Avatar className="w-12 h-12">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Current user" />
          <AvatarFallback>CU</AvatarFallback>
        </Avatar>
        <div className="flex-grow w-full md:w-auto">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full mb-2"
          />
          <Button onClick={handleAddComment} className="w-full md:w-auto">
            <Send className="mr-2 h-4 w-4" /> Post Comment
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="p-4">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={comment.avatar} alt={comment.user} />
                <AvatarFallback>{comment.user.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <h4 className="font-semibold">{comment.user}</h4>
                  <span className="text-sm text-gray-500">{format(comment.timestamp, "PPp")}</span>
                </div>
                <p className="mt-1 text-gray-700">{comment.content}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="mr-1 h-4 w-4" /> {comment.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="mr-1 h-4 w-4" /> {comment.dislikes}
                  </Button>
                  <Button variant="ghost" size="sm">Reply</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function ProjectDetails({
  creator,
  title,
  preview,
  details,
  category,
  photoCaption,
  others,
  supportNeeded,
  location,
  deadline,
  startDate,
  endDate,
}: ProjectDetailsProps) {
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
        link.download = `${title.replace(/\s+/g, "_")}_project_details.png`
        link.click()
      } catch (error) {
        console.error("Error generating screenshot:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-6" ref={projectDetailsRef}>
        <Card className="border-4 border-blue-200 rounded-lg shadow-lg overflow-hidden">
          <CardContent className="p-4 md:p-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{creator}</h2>
              <p className="text-gray-600">Project Creator</p>
            </div>

            <Separator className="my-8" />

            <div className="mb-8">
              <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={preview}
                  alt={`${title} Preview`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">{photoCaption}</p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <Badge variant="secondary" className="text-lg py-1 px-3">
                <TagIcon size={18} className="mr-2 inline-block" />
                {category}
              </Badge>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Project Duration</h3>
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="w-full md:w-auto">
                  <p className="font-semibold">Start Date:</p>
                  <p>{format(startDate, "PPP")}</p>
                </div>
                <div className="w-full md:w-auto">
                  <p className="font-semibold">End Date:</p>
                  <p>{format(endDate, "PPP")}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Project Details</h3>
              <p className="text-gray-700 leading-relaxed">{details}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Project Location</h3>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <p>{location}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Project Deadline</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <p>{format(deadline, "PPP")}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Support Needed</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {supportNeeded.map((item) => (
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
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-black mb-4">Asmi wants to support Organization Name by giving</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {supportNeeded.map((item) => (
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

            </div>


            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Additional Information</h3>
              <p className="text-gray-700 leading-relaxed">{others}</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleDownloadScreenshot} className="bg-green-600 hover:bg-green-700">
            <Download className="mr-2 h-4 w-4" /> Download Screenshot
          </Button>
        </div>

        <CommentSection />
      </div>
    </div>
  )
}

ProjectDetails.defaultProps = {
  creator: "John Doe",
  title: "Innovative Map Project",
  preview: "/placeholder.svg?height=400&width=800",
  details:
    "This project is focused on creating an interactive map platform that helps users navigate and explore different regions. Our goal is to provide a user-friendly interface that combines detailed geographical data with real-time information, making it easier for people to discover and learn about various locations around the world.",
  category: "HDA, Duralin",
  photoCaption: "Preview of the interactive map project interface",
  others:
    "For more information about this project or to discuss potential collaborations, please don't hesitate to reach out to the project creator. We're always open to new ideas and partnerships that can help us improve and expand our platform.",
  supportNeeded: [
    { id: "1", name: "Volunteers", quantity: 5, units: "", type: "Volunteers" },
    { id: "2", name: "Laptops", quantity: 3, units: "", type: "Items" },
    { id: "3", name: "Office Space", quantity: 500, units: "sqft", type: "Other" },
    { id: "4", name: "Funding", quantity: 10000, units: "USD", type: "Financial" },
  ],
  location: "San Francisco, CA",
  deadline: new Date(2023, 11, 31),
  startDate: new Date(2023, 6, 1),
  endDate: new Date(2023, 11, 31),
}
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
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">Comments</h3>
      <div className="flex items-start space-x- mb-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Current user" />
          <AvatarFallback>CU</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full mb-1 text-sm"
            rows={2}
          />
          <Button onClick={handleAddComment} size="sm" className="w-full">
            <Send className="mr-2 h-3 w-3" /> Post Comment
          </Button>
        </div>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {comments.map((comment) => (
          <Card key={comment.id} className="p-2">
            <div className="flex items-start space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={comment.avatar} alt={comment.user} />
                <AvatarFallback>{comment.user.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{comment.user}</h4>
                  <span className="text-xs text-gray-500">{format(comment.timestamp, "PP")}</span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="ghost" size="sm" className="h-6 px-1">
                    <ThumbsUp className="h-3 w-3 mr-1" /> {comment.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 px-1">
                    <ThumbsDown className="h-3 w-3 mr-1" /> {comment.dislikes}
                  </Button>
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
    <div className="h-screen w-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 overflow-hidden">
      <div className="h-full w-full p-4" ref={projectDetailsRef}>
        <Card className="h-full border-4 border-blue-200 rounded-lg shadow-lg overflow-hidden">
          <CardContent className="h-full p-4 grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-1">{creator}</h2>
                <p className="text-sm text-gray-600">Project Creator</p>
              </div>



              <Separator />



              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Project Duration</h3>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold">Start:</p>
                    <p>{format(startDate, "PP")}</p>
                  </div>
                  <div>
                    <p className="font-semibold">End:</p>
                    <p>{format(endDate, "PP")}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Project Details</h3>
                <p className="text-sm text-gray-700 leading-tight">{details}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Location</h3>
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{location}</span>
                </div>

              </div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Deadline</h3>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="flex items-center justify-center p-2 bg-white rounded-full shadow-sm">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                    {"label"}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {format("99", "PPPP")}
                  </span>
                </div>
              </div>

            </div>



            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Support Needed</h3>
                <div className="grid grid-cols-2 gap-2">
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
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-2">Asmi wants to support {creator} by giving</h3>
                <div className="grid grid-cols-2 gap-2">
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
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Additional Information</h3>
                <p className="text-sm text-gray-700 leading-tight">{others}</p>
              </div>



            </div>
          </CardContent>
        </Card>
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
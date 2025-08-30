'use client'

import React, { useEffect, useState } from "react"
import PizZip from "pizzip"
import Docxtemplater from "docxtemplater"
import { saveAs } from "file-saver"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { RouteGuard } from "../RouteGuard"

const TEMPLATE_URL = "/templateWord.docx" // public folder

const LetterPage: React.FC = () => {
  const [form, setForm] = useState({
    storeBranch: "",
    address: "",
    clientName: "",
    number: "",
    name: "",
    role: "",
    dateToday: new Date().toISOString().split("T")[0],
    dateStart: "",
    dateEnd: "",
    startTime: "",
    endTime: "",
  })

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setForm((prev) => ({ ...prev, dateToday: today }))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const formatDate = (rawDate: string): string => {
    if (!rawDate) return ""
    const date = new Date(rawDate)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(TEMPLATE_URL)
      if (!response.ok) throw new Error("Failed to fetch template file")

      const arrayBuffer = await response.arrayBuffer()
      const zip = new PizZip(arrayBuffer)
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })

      const formattedData = {
        ...form,
        dateToday: formatDate(form.dateToday),
        dateStart: formatDate(form.dateStart),
        dateEnd: formatDate(form.dateEnd),
      }

      doc.setData(formattedData)
      doc.render()

      const output = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })

      saveAs(output, "GeneratedTemplate.docx")
    } catch (error) {
      console.error("Document generation error:", error)
      alert("Failed to generate document. Check template link or placeholders.")
    }
  }

  const renderDatePicker = (
    label: string,
    rawDate: string,
    fieldName: keyof typeof form
  ) => {
    const selectedDate = rawDate ? new Date(rawDate) : undefined
    return (
      <div className="flex flex-col items-start">
        <h3 className="font-medium mb-1">{label}</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!selectedDate}
              className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (!date) {
                  setForm((prev) => ({ ...prev, [fieldName]: "" }))
                  return
                }
                const localDate = new Date(date)
                const yyyy = localDate.getFullYear()
                const mm = String(localDate.getMonth() + 1).padStart(2, "0")
                const dd = String(localDate.getDate()).padStart(2, "0")
                setForm((prev) => ({
                  ...prev,
                  [fieldName]: `${yyyy}-${mm}-${dd}`,
                }))
              }}
              className="!bg-transparent"
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <RouteGuard allowedRoles={['admin','superAdmin']}>
      <div className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
        <Header variant="signedUser" />
        <div className="flex flex-col items-center p-4 w-full sm:w-[90vw] md:w-[80vw] lg:w-[60vw] xl:w-[50vw] mx-auto">
          <h2 className="text-2xl font-bold mb-6 mt-6">Store Intro Letter</h2>
          <form className="flex flex-col gap-4 bg-gray-100 p-8 w-full rounded-2xl" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {renderDatePicker("Start Date", form.dateStart, "dateStart")}
              {renderDatePicker("End Date", form.dateEnd, "dateEnd")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col items-start">
                <h3 className="font-medium mb-1">Start Time</h3>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex flex-col items-start">
                <h3 className="font-medium mb-1">End Time</h3>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium mb-1">Store, Branch</h3>
              <input
                name="storeBranch"
                value={form.storeBranch}
                onChange={handleInputChange}
                placeholder="Enter store branch"
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium mb-1">Address</h3>
              <input
                name="address"
                value={form.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium mb-1">Client Name</h3>
              <input
                name="clientName"
                value={form.clientName}
                onChange={handleInputChange}
                placeholder="Enter client name"
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium mb-1">Your Number</h3>
              <input
                name="number"
                value={form.number}
                onChange={handleInputChange}
                placeholder="Enter your number"
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium mb-1">Your Role</h3>
              <input
                name="role"
                value={form.role}
                onChange={handleInputChange}
                placeholder="Enter your role"
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium mb-1">Your Name</h3>
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex flex-col items-start">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Generate
              </button>
            </div>
          </form>
        </div>
      </div>
    </RouteGuard>
  )
}

export default LetterPage

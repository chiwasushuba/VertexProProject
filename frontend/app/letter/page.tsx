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

const LetterPage: React.FC = () => {
  const [templateFile, setTemplateFile] = useState<File | null>(null)
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
  })

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setForm((prev) => ({ ...prev, dateToday: today }))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setTemplateFile(file)
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!templateFile) {
      alert("Please upload a .docx template file.")
      return
    }

    const reader = new FileReader()
    reader.readAsArrayBuffer(templateFile)

    reader.onload = () => {
      try {
        const zip = new PizZip(reader.result as ArrayBuffer)
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        })

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
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        })

        saveAs(output, "GeneratedTemplate.docx")
      } catch (error) {
        console.error("Document generation error:", error)
        alert("Failed to generate document. Check template placeholders.")
      }
    }

    reader.onerror = () => {
      console.error("File reading error:", reader.error)
      alert("Could not read the template file.")
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
                setForm((prev) => ({
                  ...prev,
                  [fieldName]: date ? date.toISOString().split("T")[0] : "",
                }))
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <RouteGuard allowedRoles={['admin','superAdmin']}>
      <div className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]">
        <Header variant='signedUser' />
        <div className="flex flex-col items-center p-4 w-full sm:w-[90vw] md:w-[80vw] lg:w-[60vw] xl:w-[50vw] mx-auto">
          <h2 className="text-2xl font-bold mb-6 mt-6">Store Intro Letter</h2>
          <form className="flex flex-col gap-4 bg-gray-100 p-8 w-full rounded-2xl" onSubmit={handleSubmit}>
            
            {/* Upload Template */}
            <div className="flex flex-col items-start">
              <h3 className="font-medium mb-1">Upload Template (.docx)</h3>
              <input
                type="file"
                accept=".docx"
                onChange={handleFileChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {renderDatePicker("Start Date", form.dateStart, "dateStart")}
              {renderDatePicker("End Date", form.dateEnd, "dateEnd")}
            </div>
            
            {/* Store, Branch */}
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
            
            {/* Address */}
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

            {/* Client Name */}
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
            
            {/* Your Number */}
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

            {/* Your Role */}
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

            {/* Your Name */}
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

            {/* Submit */}
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

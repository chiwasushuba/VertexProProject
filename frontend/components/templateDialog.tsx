'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Button } from './ui/button'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import api from '@/utils/axios'
import { useAuthContext } from '@/hooks/useAuthContext'

interface TemplateDialogProps {
  requesterId: string
  name: string
  email: string
  open: boolean
  setOpen: (open: boolean) => void
}

const TemplateDialog = ({
  requesterId,
  name,
  email,
  open,
  setOpen,
}: TemplateDialogProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('')
  const { userInfo } = useAuthContext() // ✅ get logged-in user

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      alert('Please upload a template file.')
      return
    }

    setLoading(true)
    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      const zip = new PizZip(arrayBuffer)
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: '<<', end: '>>' },
      })

      // Insert placeholders
      doc.setData({
        name: name,
        role: role,
      })

      doc.render()

      // Generate output file
      const output = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      // Prepare formData
      const formData = new FormData()
      formData.append('to', email)
      formData.append('file', new File([output], 'FilledTemplate.docx'))

      // Send to API
      await api.post('/email/send', formData)

      if (requesterId) {
        await api.patch(`/user/changeRequestLetter/${requesterId}`, {
          "requestLetter": false,
        })
      }

      alert('File successfully submitted!')
      setOpen(false)
    } catch (err) {
      console.error('Template processing error:', err)
      alert('Failed to process template.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            Send Intro Letter
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 justify-center">
          <Label>Upload Template File Below</Label>
          <input type="file" accept=".docx" onChange={handleFileChange} />
          <Label>Enter Role for: {name}</Label>
          <input placeholder='Input Role' value={role} onChange={(e) => setRole(e.target.value)} className='border border-solid rounded-md' />
          <Button
            className="w-full mt-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TemplateDialog

'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import api from '@/utils/axios'

interface SendIdButtonProps {
  requesterId: string
  disabled: boolean
}

const SendIdButton: React.FC<SendIdButtonProps> = ({ requesterId, disabled }: SendIdButtonProps) => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (!requesterId) return
    let mounted = true

    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${requesterId}`)
        if (mounted) setUser(res.data)
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    }

    fetchUser()
    return () => {
      mounted = false
    }
  }, [requesterId])

  const handleSubmit = async () => {
    if (!user) {
      alert('User data not loaded.')
      return
    }

    setLoading(true)
    try {
      // Fetch the .docx template from public folder
      const response = await fetch('/CompanyIdTemplate.docx')
      const arrayBuffer = await response.arrayBuffer()

      const zip = new PizZip(arrayBuffer)
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: '{', end: '}' },
      })

      // Build fullname
      const fullname = [user.firstName, user.middleName, user.lastName]
        .filter(Boolean)
        .join(' ')
        .trim()

      // Expiry date (MM/DD/YYYY)
      const expiry = new Date()
      expiry.setFullYear(expiry.getFullYear() + 1)
      const expiryDate = expiry.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })

      // Match template placeholders exactly
      const dataForTemplate = {
        FullName: fullname,
        expiryDate,
        Address: user.completeAddress ?? user.address ?? '',
        contactNum: user.gcashNumber != null ? String(user.gcashNumber) : '',
        role: user.position ?? '',
        company_id: user.company_id ?? '',
      }

      doc.setData(dataForTemplate)
      doc.render()

      // Generate filled .docx
      const outputBlob = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      const outFilename = `Vertex Pro-${user.firstName ?? 'user'}.docx`
      const outFile = new File([outputBlob], outFilename, {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      // Send via API
      const formData = new FormData()
      const toEmail = user.email ?? ''
      if (!toEmail) {
        alert('User has no email on record.')
        setLoading(false)
        return
      }
      formData.append('to', toEmail)
      formData.append('file', outFile, outFilename)

      await api.post('/email/send-id', formData)

      // Clear change request flag
      if (requesterId) {
        try {
          await api.patch(`/user/changeRequestId/${requesterId}`, { requestId: false })
        } catch (err) {
          console.error('Failed to update changerequest flag:', err)
        }
      }

      alert('File successfully submitted!')
    } catch (err) {
      console.error('Template processing error:', err)
      alert('Failed to process template.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button 
        onClick={handleSubmit} 
        disabled={disabled || !requesterId || loading} 
        className="bg-blue-600 hover:bg-blue-700"
      >
        {loading ? 'Sending...' : 'Send ID'}
      </Button>
    </>
  )
}

export default SendIdButton

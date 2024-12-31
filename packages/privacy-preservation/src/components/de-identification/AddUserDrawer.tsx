import React, { useEffect, useState, useCallback } from 'react'

import { Typography, Divider, Card, Drawer, IconButton, CircularProgress } from '@mui/material'

import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'

import PerfectScrollbar from 'react-perfect-scrollbar'

import type { FilesType } from '@/types/userTypes'


type Props = {
  open: boolean
  handleClose: () => void
  fileSelected: FilesType | undefined
  operation: 'Original' | 'De-Identify'
  token: string | undefined
}

const FileContentDrawer: React.FC<Props> = ({ open, handleClose, fileSelected, operation, token }) => {
  const [fileContent, setFileContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchFileContent = useCallback(async () => {
    if (!open || !fileSelected?.name || !token) return

    setIsLoading(true)

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...(operation === "De-Identify" && { "X-ANON": 'true' })
    }

    setTimeout( async () => {
    try {
      let response;

      if(fileSelected?.type === "FHIR"){
        response = await fetch(`https://sandbox.xcaliberapis.com/public-sandbox/fhir-gateway/fhir/R4/Patient/${fileSelected?.name}`, {
          method: "GET",
          headers: {
            ...(operation === "De-Identify" && { "X-ANON": 'true' })
          }
        })
      }
      else {
      response = await fetch("https://sandbox.xcaliberapis.com/public-sandbox/directory/api/v1/entities/patient/entries/lineage/message", {
        method: "POST",
        headers,
        body: JSON.stringify({ bundle_id: fileSelected?.name }),
      })
    }
      
    const data = await response.json()

    setFileContent(fileSelected?.type === "FHIR" ? data : data.rawdata)

    } catch (error) {
      console.error('Error fetching file content:', error)
      setFileContent('Error loading content')
    } finally {
      setIsLoading(false)
    }
  }, 1500);
  }, [open, fileSelected?.name, token, operation])

  useEffect(() => {
    fetchFileContent()
  }, [fetchFileContent])

  const handleReset = () => {
    handleClose()
    setFileContent('')
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: "50%", sm: "50%" } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>{operation === "Original" ? "Identifiable View" : "De-identified View"}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <Card sx={{
          padding: '20px',
          margin: '20px',
          overflow: 'auto',
        }}>
      {isLoading ? (
        <div className='flex items-center justify-center flex-col'>
          <CircularProgress />
          <Typography variant='h5' className='pl-3'>Processing your request...</Typography> 
        </div>
      ) : (<>{
        fileSelected?.type !== "FHIR" ? (
          <Typography variant='h5' sx={{
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
          }}>{fileContent}</Typography>
        ) : (
          <PerfectScrollbar>
            <JsonView style={{
              fontSize: '16px',
              padding: '10px',
              maxHeight: '70rem',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '5px',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
            }} src={fileContent}
            />
          </PerfectScrollbar>
        )
      }
      </>) 
      }
      </Card>
    </Drawer>
  )
}

export default FileContentDrawer
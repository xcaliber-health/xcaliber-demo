import React, { useEffect, useState } from 'react'

import { Card, Dialog, Divider, IconButton, Typography, CircularProgress } from '@mui/material'
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

import type { FilesType } from '@/types/userTypes';

function DiffDialog({ dialogOpen, setDialogOpen, token, fileSelected }: { dialogOpen: boolean, setDialogOpen: (open: boolean) => void, token: string | undefined, fileSelected: FilesType | undefined }) {
    const [content, setContent] = useState({ original: '', deID: '' })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!fileSelected?.name) return

        const fetchContent = async (isAnonymized:any) => {
            try {
                let response;

                if(fileSelected?.type === "FHIR"){
                    response = await fetch(`https://sandbox.xcaliberapis.com/public-sandbox/fhir-gateway/fhir/R4/Patient/${fileSelected?.name}`, {
                        method: "GET",
                        headers: {
                            ...(isAnonymized && { "X-ANON": 'true' })
                        }
                    })
                }
                else {
                    response = await fetch("https://sandbox.xcaliberapis.com/public-sandbox/directory/api/v1/entities/patient/entries/lineage/message", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                            ...(isAnonymized && { "X-ANON": 'true' })
                        },
                        body: JSON.stringify({
                            bundle_id: fileSelected?.name,
                        }),
                    })
                }   

                const data = await response.json()

                return fileSelected?.type === "FHIR" ? JSON.stringify(data, null, 2) : data.rawdata
                
            } catch (error) {
                console.error(`Error fetching ${isAnonymized ? 'anonymized' : 'original'} content:`, error)
                
                return ''
            }
        }

        const updateContent = async () => {
            setIsLoading(true)
            setTimeout(async () => {
                try {
                    const [originalContent, deIDContent] = await Promise.all([
                        fetchContent(false),
                        fetchContent(true)
                    ])
    
                    setContent({ original: originalContent, deID: deIDContent })
                } catch (error) {
                    console.error('Error updating content:', error)
                } finally {
                    setIsLoading(false)
                }
            }, 1500)
        }

        updateContent()
    }, [fileSelected, token])

    return (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xl">
            <div className='flex items-center justify-between pli-5 plb-4'>
                <Typography variant='h5'>{"Compare Views"}</Typography>
                <IconButton size='small' onClick={() => setDialogOpen(false)}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <Card sx={{
                padding: '20px',
                margin: '20px',
                overflow: 'auto',
                minHeight: '300px', // Ensure a minimum height for the loading spinner
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}>
                {isLoading ? (
                    <div className='flex items-center justify-center flex-col'>
                        <CircularProgress />
                        <Typography variant='h5' className='pl-3'>Processing your request...</Typography> 
                    </div>
                ) : content.original && content.deID ? (
                    <ReactDiffViewer
                        oldValue={content.original}
                        newValue={ fileSelected?.type === "FHIR" ? content.deID : content.deID.replace(/\n/g, '')}
                        splitView={true}
                        leftTitle="Original Content"
                        rightTitle="DeIdentified Content"
                        disableWordDiff={false}
                        hideLineNumbers={true}
                        compareMethod={DiffMethod.WORDS}
                        styles={{
                            diffContainer: { overflow: 'auto', width: '100%' },
                            diffRemoved: { backgroundColor: 'rgba(255, 0, 0, 0.1)' },
                            diffAdded: { backgroundColor: 'rgba(0, 255, 0, 0.1)' },
                        }}
                    />
                ) : (
                    <Typography>No content available</Typography>
                )}
            </Card>
        </Dialog>
    )
}

export default DiffDialog
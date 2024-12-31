import React from 'react'

import { Button, TextField, Typography } from '@mui/material'

export default function ComingSoon() {
    return (
        <div className="flex items-center justify-center h-full flex-col" style={{
            backgroundImage: 'url(/images/tab-bg.png)',
        }}>
            <Typography sx={{ fontSize: '72px', fontWeight: 'bold', color: '#3D3D3D'}} >Coming Soon</Typography>
            <TextField variant='outlined' placeholder="Enter your email" className="w-96" />
            <Button variant='contained' color='primary' className="mt-4" style={{ borderRadius: '50px' }}>Notify Me</Button>
        </div>
    )
}
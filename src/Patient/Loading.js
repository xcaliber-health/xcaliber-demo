import { CircularProgress as Spinner,Box } from '@mui/material'
import React from 'react'

const Loading = () => <Box height = "100%" display="flex" justifyContent={"center"} alignItems="center"><Spinner  />
</Box> 
export default Loading

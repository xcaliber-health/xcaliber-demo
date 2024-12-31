// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

// Type Imports
import { Box, Typography } from '@mui/material'

import type { FilesType } from '@/types/userTypes'

const TableFilters = ({ setData, tableData }: { setData: (data:  FilesType[]) => void; tableData?: FilesType[] }) => {
  // States
  const [type, setType] = useState<FilesType['type']>('')

  useEffect(() => {
    const filteredData = tableData?.filter(file => {
      if (type && file.type !== type) return false

      return true
    })

    setData(filteredData || [])
  }, [tableData, setData, type])

  return (
    <CardContent sx={{
      padding: '10px 20px'
    }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          alignItems: 'center',
          width: '250px'
        }}>
          <Typography variant='h5'>Filters</Typography>
          <FormControl fullWidth>
            <InputLabel id='file-type-select' size='small'>Select File Type</InputLabel>
            <Select
              fullWidth
              id='select-file-type'
              value={type}
              onChange={e => setType(e.target.value)}
              label='Select File Type'
              labelId='file-type-select'
              inputProps={{ placeholder: 'Select File Type' }}
              size='small'
            >
              <MenuItem value=''>Select File Type</MenuItem>
              <MenuItem value='HL7'>HL7</MenuItem>
              <MenuItem value='FHIR'>FHIR</MenuItem>
              <MenuItem value='CSV'>CSVs</MenuItem>
              <MenuItem value='MRN'>Patient Notes</MenuItem>
            </Select>
          </FormControl>
        </Box>
    </CardContent>
  )
}

export default TableFilters

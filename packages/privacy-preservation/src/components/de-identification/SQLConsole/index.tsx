'use client'

// React Imports
import { useMemo, useState } from 'react'

import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';

// MUI Imports
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
import type { Breakpoint } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'
import { useMedia } from 'react-use'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Icon Imports
import Cog from '../../../assets/Cog';

import styles from './styles.module.css'
import { Button, Card, Stack } from '@mui/material'
import SQLTable from '../SQLTable';

type CustomizerProps = {
  breakpoint?: Breakpoint | 'xxl' | `${number}px` | `${number}rem` | `${number}em`
  token?: string
}

const SQLConsole = ({ breakpoint = 'lg', token }: CustomizerProps) => {
  // States
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any>()

  const onRunQuery = async () => {
    const response = await fetch('https://sandbox.xcaliberapis.com/public-sandbox/directory/api/v1/entities/patient/entries/query/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query })
    })

    const data = await response.json()

    setResult(data)
  }

  const columns = useMemo(() => 
    result?.length > 0 ? Object.keys(result[0]).map((key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
    })) : [],
  [result]);

  // Hooks
  const theme = useTheme()

  // Vars
  let breakpointValue: CustomizerProps['breakpoint']

  switch (breakpoint) {
    case 'xxl':
      breakpointValue = '1920px'
      break
    case 'xl':
      breakpointValue = `${theme.breakpoints.values.xl}px`
      break
    case 'lg':
      breakpointValue = `${theme.breakpoints.values.lg}px`
      break
    case 'md':
      breakpointValue = `${theme.breakpoints.values.md}px`
      break
    case 'sm':
      breakpointValue = `${theme.breakpoints.values.sm}px`
      break
    case 'xs':
      breakpointValue = `${theme.breakpoints.values.xs}px`
      break
    default:
      breakpointValue = breakpoint
  }

  const breakpointReached = useMedia(`(max-width: ${breakpointValue})`, false)
  const isMobileScreen = useMedia('(max-width: 600px)', false)
  const isBelowLgScreen = useMedia('(max-width: 1200px)', false)

  const ScrollWrapper = isBelowLgScreen ? 'div' : PerfectScrollbar

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    !breakpointReached && (
      <div
        className={classnames('customizer bs-full flex flex-col', styles.customizer, {
          [styles.show]: isOpen,
          [styles.smallScreen]: isMobileScreen
        })}
      >
        <div
          className={classnames('customizer-toggler flex items-center justify-center cursor-pointer', styles.toggler)}
          onClick={handleToggle}
          style={{textAlign: 'center', backgroundColor: '#6B89F9'}}
        >
          <Cog /> SQL Console
        </div>
        <div className={classnames('customizer-header flex items-center justify-between', styles.header)}>
          <div className='flex flex-col'>
            <h6 className={styles.customizerTitle}>SQL Console</h6>
            <p className={styles.customizerSubtitle}>
              A tool that allows you to query the database directly.
            </p>
          </div>
          <div className='flex gap-4'>
            <i
              className={classnames('ri-close-line cursor-pointer', styles.actionActiveColor)}
              onClick={handleToggle}
            />
          </div>
        </div>
        <ScrollWrapper
          {...(isBelowLgScreen
            ? { className: 'bs-full overflow-y-auto overflow-x-hidden' }
            : { options: { wheelPropagation: false, suppressScrollX: true } })}
        >
          <div className='flex flex-col gap-4 p-4'>
            <h4>Example Queries</h4>
            <Stack direction={'row'} spacing={2} sx={{
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center',
            }}>
            <Chip
              label='Count of Patient Records by Lineage'
              color='success'
              onClick={() => setQuery(`SELECT lineage, COUNT(*) AS lineage_count 
FROM patient 
GROUP BY lineage 
ORDER BY lineage_count DESC;`)}
              style={{ cursor: 'pointer', width: 'fit-content' }}
            />
            <Chip
              label='Count Encounters by Admit Source and Reason'
              color='warning'
              onClick={() => setQuery(`SELECT admit_source, reason, COUNT(*) AS count
FROM encounter
GROUP BY admit_source, reason
ORDER BY count DESC;`)}
              style={{ cursor: 'pointer', width: 'fit-content' }}
            />
            <Chip
              label='Average Balance by Patient Class'
              color='info'
              onClick={() => setQuery(`SELECT patient_class, AVG(current_patient_balance) AS average_balance
FROM encounter
GROUP BY patient_class
ORDER BY average_balance DESC;`)}
              style={{ cursor: 'pointer', width: 'fit-content' }}
            />
            </Stack>
          <Card className='p-4'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <CodeMirror
                  value={query}
                  extensions={[sql()]}
                  onChange={(value) => setQuery(value)}
                  minHeight='100px'
                  height='auto'
                  placeholder={'Write your SQL query here...'}
                  basicSetup={
                    {
                      lineNumbers: false,
                    }
                  }
                />
              </div>
            </div>
          </Card>
            <Button variant='contained' onClick={onRunQuery} className='max-sm:is-full'>
              Run Query
            </Button>
          <div className='flex flex-col gap-4 p-4'>
            <h5>Results</h5>
          {result?.length > 0 && (
              <SQLTable cardStyles={{
                padding: '10px',
                height: '55vh',
              }} columns={columns} data={result} />
          )}
          {result?.code && (
            <div className='flex items-center justify-center'>
              <Chip label={result.message} color='error' />
            </div>
          )}
          </div>
          </div>
        </ScrollWrapper>
      </div>
    )
  )
}

export default SQLConsole

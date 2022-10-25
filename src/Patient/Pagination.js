import { usePagination } from './service/service'
import React, { useMemo } from 'react'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { Box, Typography,IconButton } from '@mui/material'
const Pagination = (props) => {
  const DOTS = '...'

  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize } = props
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  })

  const lastPage = useMemo(() => {
    return paginationRange[paginationRange.length - 1]
  },[totalCount])

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        margin: 'auto',
        justifyContent: 'space-evenly',
        width: '40%',
        alignItems: "center"
      }}
    >
      {/* Left navigation arrow */}
      <IconButton color="primary">
      <KeyboardArrowLeftIcon
        onClick={onPrevious}
        sx={{

          display: `${currentPage==1 ? 'none' : 'flex'}`
        }}
      ></KeyboardArrowLeftIcon>
      </IconButton>
      {paginationRange.map((pageNumber) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return <Typography>&#8230;</Typography>
        }

        // Render our Page Pills
        return (
          <Box
            onClick={() => onPageChange(pageNumber)}
            sx={{

              backgroundColor: `${pageNumber == currentPage ? 'darkgrey' : 'inherit'}`,
              borderRadius: '50%',
              height: '25px',
              width: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
                  <IconButton color="primary">
            <Typography variant='caption'>
            {pageNumber}

            </Typography>
            </IconButton>

          </Box>
        )
      })}
      {/*  Right Navigation arrow */}
      <IconButton color="primary">

      <KeyboardArrowRightIcon
        onClick={onNext}
        sx={{

          display: `${currentPage==lastPage ? 'none' : 'flex'}`
        }}
      ></KeyboardArrowRightIcon>
            </IconButton>

    </Box>
  )
}

export default Pagination

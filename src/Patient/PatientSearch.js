import { TextInput } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'




const PatientSearchInput = (props) => {
  const { onChange } = props

  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebounce(searchText, 500)

  useEffect(() => {
    onChange({
      queryString: debouncedSearchText,
    })
  }, [debouncedSearchText, onChange])

  const onSearchBoxChange = (event) => {
    const queryString = event.currentTarget.value
    setSearchText(queryString)
  }

  return (
    <TextInput
      size="lg"
      type="text"
      onChange={onSearchBoxChange}
      value={searchText}
      placeholder={'search'}
    />
  )
}

export function useDebounce(value, delayInMilliseconds) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const debounceHandler = setTimeout(() => setDebouncedValue(value), delayInMilliseconds)

    return () => clearTimeout(debounceHandler)
  }, [value, delayInMilliseconds])

  return debouncedValue
}


export default PatientSearchInput

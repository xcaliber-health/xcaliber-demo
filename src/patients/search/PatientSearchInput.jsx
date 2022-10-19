import { TextInput } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'

import useDebounce from '../../shared/hooks/useDebounce'
import useTranslator from '../../shared/hooks/useTranslator'


const PatientSearchInput = (props) => {
  const { onChange } = props
  const { t } = useTranslator()

  const [searchText, setSearchText] = useState<string>('')
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
      placeholder={t('actions.search')}
    />
  )
}

export default PatientSearchInput

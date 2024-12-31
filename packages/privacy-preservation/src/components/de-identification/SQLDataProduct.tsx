import React, { useMemo, useState, useCallback, useEffect } from 'react';

import { FormControl, Grid, InputLabel, MenuItem, Select, Switch, Tab, Typography } from '@mui/material';
import { TabPanel, TabContext } from '@mui/lab';
import type { FilterFn } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

import CustomAvatar from '../mui/Avatar';
import CustomTabList from '../mui/TabList';
import { document_providers, documents, encounters, interactions } from './data/tables';
import type { SQLDataProductType } from '../../types/tableTypes';
import SQLConsole from './SQLConsole';
import SQLTable from './SQLTable';

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({ itemRank });
  
return itemRank.passed;
};

const SQLDataProduct = ({ TablesData, token }: { TablesData: SQLDataProductType[], token: string }) => {
  const [activeTab, setActiveTab] = useState('documents');
  const [data, setData] = useState<any>(documents);
  const [role, setRole] = useState('Regular Access');

  const handleChange = useCallback((event: any, newValue: React.SetStateAction<string>) => {
    setActiveTab(newValue);
  }, []);

  useEffect(() => {
    const dataMap: { [key: string]: any } = {
      documents,
      interactions,
      encounters,
      document_providers
    };

    setData(dataMap[activeTab] || []);
  }, [activeTab]);

  const columns = useMemo(() => 
    Object.keys(data[0] || {}).map((key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
    })),
  [data]);

  return (
    <>
      <TabContext value={activeTab}>
        <Grid container spacing={6}>
          <Grid item xs={12} className='flex items-center gap-16'>
            <Typography variant='h4'>Patient Chart</Typography>
            <CustomTabList onChange={handleChange} pill='true'>
              {TablesData.map((item) => (
                <Tab
                  key={item.id}
                  label={item.title}
                  value={item.id}
                  icon={<i className={`${item.icon} !mbe-0 mie-1.5`} />}
                  className='!flex-row !justify-start whitespace-nowrap'
                />
              ))}
            </CustomTabList>
            <div className='flex items-center gap-2'>
            <FormControl fullWidth>
              <InputLabel id='file-type-select' size='small'>Select Role</InputLabel>
              <Select
                fullWidth
                id='select-file-type'
                value={role}
                onChange={e => setRole(e.target.value)}
                label='Select Role'
                labelId='file-type-select'
                inputProps={{ placeholder: 'Select Role' }}
                size='small'
                sx={{ minWidth: '200px' }}
              >
                <MenuItem value='Regular Access'>Regular Access</MenuItem>
                <MenuItem value='Privileged Access'>Privileged Access</MenuItem>
              </Select>
            </FormControl>
            </div>
          </Grid>
          <Grid item xs={12}>
            {TablesData.map((item) => (
              <TabPanel key={item.id} value={item.id} className='p-0'>
                <div className='flex items-center gap-4 mbe-4'>
                  <CustomAvatar skin='light' color='primary' variant='rounded' size={50}>
                    <i className={item.icon} />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h5'>{item.title}</Typography>
                    <Typography>{item.subtitle}</Typography>
                  </div>
                </div>
                <SQLTable
                  cardStyles={{
                    padding: '10px',
                    minHeight: '300px',
                  }}
                  columns={columns}
                  data={data}
                />
              </TabPanel>
            ))}
          </Grid>
        </Grid>
      </TabContext>
      <SQLConsole token={token} />
    </>
  );
};

export default SQLDataProduct;
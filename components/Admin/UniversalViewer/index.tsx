// Libs
import React, { useMemo } from 'react';
import moment from 'moment';
// MUI Components 
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// Components
import Gallery, { Media } from '../Gallery';
import GoogleMapView from '../GoogleMapView';

interface UniversalViewerProps {
  data: any;
  title?: string;
  defaultOpen?: boolean;
  hideKeys?: string[];
  customHandlers?: Record<string, (value: any) => React.ReactNode>;
  emptyText?: string;
}

const dateKeys = ['created_at', 'updated_at', 'last_seen_at', 'start_datetime', 'end_datetime', 'birthday', 'terms_accepted_at'];

const convertDate = (params: { key: string; value: number | null }) => {
  const { value, key } = params;
  if (!value) return '-';
  else if (key === 'birthday') return moment(value * 1000).format('YYYY-MM-DD');
  return moment(value).format('YYYY.MM.DD, HH:mm');
};

const formatKey = (key: string) => {
  return key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
};

const UniversalViewer: React.FC<UniversalViewerProps> = ({
  data,
  title = 'Details',
  defaultOpen = false,
  hideKeys = [],
  customHandlers = {},
  emptyText = 'No data',
}) => {
  const renderValue = (key: string, value: any): React.ReactNode => {
    try {
      const customHandler = customHandlers[key];
      if (customHandler) {
        return customHandler(value);
      }

      if (dateKeys.includes(key)) {
        return convertDate({ key, value });
      }

      if (Array.isArray(value)) {
        return value.map((item, index) => (
          <React.Fragment key={index}>
            <br />
            {`${item}`}     
          </React.Fragment>
        ));
      }

      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }


      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        return (
          <Box>
            {Object.entries(value).map(([nestedKey, nestedValue]) => (
              <Box key={nestedKey} mb={1}>
                <span  style={{fontWeight: 'bold'}}>
                  {formatKey(nestedKey)}{': '}
                </span>
                <span>
                  {renderValue(nestedKey, nestedValue)}
                </span>
              </Box>
            ))}
          </Box>
        );
      }


      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        // if (value.media_type && value.url) {
        //   return <img src={value.url} alt={value.name} style={{maxWidth: '100%'}} />;
        // }
        return JSON.stringify(value);
      }

      return value;
    } catch (error) {
      return `${value}`;
    }
  };

  const filteredData = useMemo(() => {
    try {
      hideKeys.forEach(key => delete data?.[key]);
      delete data?.relations;
      return data;
    } catch (error) {
      return data;
    }
  }, [data, hideKeys]);

  const noData = !filteredData?.[0]?.media_type && (filteredData && Object?.entries(filteredData)?.length === 0) || data === null;

  return (
    <Accordion defaultExpanded={defaultOpen}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        
        {filteredData?.[0]?.media_type ? <Gallery items={(filteredData as Media[])} /> : filteredData?.url ? <img src={filteredData?.url} alt={filteredData?.name} style={{maxWidth: '100%'}} /> : (
          <TableContainer className='universal-viewer-table'>
          <Table>
            <TableBody>
              {filteredData && Object.entries(filteredData).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ fontWeight: 'bold', padding: 4, paddingRight: 12, verticalAlign: 'top' }}
                  >
                    {formatKey(key)}
                  </TableCell>
                  <TableCell style={{ padding: 4 }}>
                    
                    {key === 'coordinates' && filteredData[key]?.coordinates ? <GoogleMapView markerPosition={filteredData[key]?.coordinates ? { lat: filteredData[key]?.coordinates[1], lng: filteredData[key]?.coordinates[0] } : undefined} /> : (
                    <Typography variant="body2">
                    {renderValue(key, value)}
                  </Typography>
                    )}

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}

        

        {noData ? <Typography variant="body2">{emptyText}</Typography> : null}
      </AccordionDetails>
    </Accordion>
  );
};

export default UniversalViewer;

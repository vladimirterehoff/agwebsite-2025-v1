import React, {useState, useEffect} from 'react';
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  Select,
  TextField,
} from '@mui/material';
import {Line} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {DashboardActions} from "@/app-redux/dashboard/actions";
import {useSelector} from "react-redux";
import {AppState} from "@/app-redux/state";
import Autocomplete from "@/components/Common/FormComponents/Autocomplete";
import {providersUrl} from "@/app-redux/providers/actions";
import {FormProvider, useForm} from "react-hook-form";
import {WorkshopFormValues} from "@/containers/Admin/Workshops/Form";
import Loader from "@/components/Common/Loader";
import {useAlert} from "@/hooks/dialog/useAlert";
import {Provider, PROVIDER_TYPE} from "@/app-redux/providers/model";
import { getProviderName } from '@/helpers/getProviderName';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OrdersGraph: React.FC = () => {
  // Hooks
  const formHook = useForm<WorkshopFormValues>();

  const [errors, setErrors] = useState<string>('');
  const [provider, setProvider] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('1month');
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [customDateRange, setCustomDateRange] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  });
  const [graphData, setGraphData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const [alertModal, openAlertModal] = useAlert(
    'Errors',
    <div style={{color:'red', fontFamily: 'Arial'}}>{errors}</div>
  );

  const {loading, error, data} = useSelector((state: AppState) => state.ordersGraph);

  useEffect(() => {
    // Fetch and format data based on filters
    const fetchData = async () => {
      try {
        const dates = getDateRange(dateRange);
        await DashboardActions.getOrdersGraph(`from=${dates.from}&to=${dates.to}&provider_id=${provider}`);
      } catch (e: any) {
        setErrors(e.message ?? e.errors[0].errors[0]);
        openAlertModal();
      }
    };

    if ((dateRange === 'custom' && customDateRange.from && customDateRange.to) || dateRange !== 'custom') {
      fetchData();
    }
  }, [provider, dateRange, customDateRange]);

  useEffect(() => {
    const formattedData = formatGraphData(data);
    setGraphData(formattedData);
  }, [data]);

  const getDateRange = (dateRange: string): { from: string; to: string } => {
    const now = new Date();

    // Function to format the date as YYYY-MM-DD
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Ensure `to` is today's date with no time (set time to 00:00:00)
    let to = new Date(now.setHours(0, 0, 0, 0));  // This modifies `now`, so let's clone it for `from`

    let from: Date;
    if (dateRange === '1month') {
      from = new Date(to); // Clone `to` before modifying
      from.setMonth(to.getMonth() - 1);
    } else if (dateRange === '3months') {
      from = new Date(to); // Clone `to` before modifying
      from.setMonth(to.getMonth() - 3);
    } else if (dateRange === '1year') {
      from = new Date(to); // Clone `to` before modifying
      from.setFullYear(to.getFullYear() - 1);
    }  else if (dateRange === 'custom') {

      if (customDateRange.from > customDateRange.to) {
        setCustomDateRange((prev) => ({...prev, to: ''}))
        throw new Error('The to field must be a date after or equal to from.');
      }

      from = new Date(customDateRange.from);
      to = new Date(customDateRange.to);
    } else if (dateRange === 'all') {
      if (to.getFullYear() === 2034) {
        from = new Date('2024-11-01');
      } else {
        from = new Date(to);
        from.setFullYear(to.getFullYear() - 10);
      }
    } else {
      throw new Error('Invalid date range');
    }

    return {
      from: formatDate(from),
      to: formatDate(to),
    };
  };

  const formatGraphData = (data: any[]) => {
    const groupedData = data.reduce(
      (acc, d) => {
        acc.labels.push(d.date);
        acc.data.push(d.orders_count);
        acc.total += d.orders_count;
        return acc;
      },
      { labels: [], data: [], total: 0 }
    );

    setOrdersCount(groupedData.total);

    return {
      labels: groupedData.labels,
      datasets: [
        {
          label: 'Finished orders',
          data: groupedData.data,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
        },
      ],
    };
  };

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  return (
    <Box sx={{padding: 3}}>
      <Typography variant="h6" gutterBottom>
        Finished orders: {ordersCount}
      </Typography>
      <FormProvider {...formHook}>
        <form
          noValidate
          autoComplete="new-password"
        >
          <Box sx={{display: 'flex', gap: 2, marginBottom: 3}}>
            <Loader isLoading={loading}/>
            {alertModal}
            {/* Provider Filter */}
            <FormControl size="small" style={{width:300}}>
              <Autocomplete
                size={"small"}
                onChange={(e) => setProvider(e?.id ?? '')}
                name={"provider_id"}
                searchParams={{
                  url: providersUrl,
                  searchBy: ["translations.name", "user.first_name", "user.last_name"],
                  expand: ['user', 'translations']
                }}
                label={"Provider"}
                labelName={"name"}
                getName={(provider: Provider) => getProviderName(provider)}
                multilang
              />
            </FormControl>

            {/* Date Range Filter */}
            <FormControl size="small" style={{width:150}}>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                displayEmpty
              >
                <MenuItem value="1month">1 Month</MenuItem>
                <MenuItem value="3months">3 Months</MenuItem>
                <MenuItem value="1year">1 Year</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>

            {/* Custom Date Range Inputs */}
            {dateRange === 'custom' && (
              <Box sx={{display: 'flex', gap: 2}}>
                <TextField
                  type="date"
                  label="From"
                  size="small"
                  value={customDateRange.from}
                  onChange={(e) =>
                    setCustomDateRange((prev) => ({...prev, from: e.target.value}))
                  }
                  InputLabelProps={{shrink: true}} // Ensures the label doesn't overlap
                  inputProps={{max: today}} // Disable future dates
                />
                <TextField
                  type="date"
                  label="To"
                  size="small"
                  value={customDateRange.to}
                  onChange={(e) =>
                    setCustomDateRange((prev) => ({...prev, to: e.target.value}))
                  }
                  InputLabelProps={{shrink: true}} // Ensures the label doesn't overlap
                  inputProps={{max: today}} // Disable future dates
                />
              </Box>
            )}
          </Box>
        </form>
      </FormProvider>
      {/* Graph */}
      <Box>
        <Line
          data={graphData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default OrdersGraph;

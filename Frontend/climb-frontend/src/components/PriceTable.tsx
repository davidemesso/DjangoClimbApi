import { Card, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface PriceRow {
  readonly id: number;
  readonly article: string;
  readonly price: string;
}


export default function PriceTable() {
  const [prices, setPrices] = useState<Array<PriceRow>>([])
  
  const columns: GridColDef[] = [
    { field: 'price', headerName: 'Prezzo', width: 120,
      renderCell: (params) => 
        <Typography>
          {"€ " + params.row.price}
        </Typography>
    },
    { field: 'article', headerName: 'Articolo', width: 600 },
  ];

  useEffect(() => {
    
    const fetchData = async () => {
      await axios.get('http://localhost:8000/api/prices')
      .then(response => {
        setPrices(response.data)
      })
      .catch(error => {
        console.error(error);
      });
    }

    fetchData()
      .catch(console.error);
  }, []);

  return (
    <Card className="w-[90%] mx-auto m-2">
      <CardContent>
        <DataGrid
          rows={prices}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 20 },
            },
          }}
          disableRowSelectionOnClick
          pageSizeOptions={[20]}
        />
      </CardContent>
    </Card>
  );
}
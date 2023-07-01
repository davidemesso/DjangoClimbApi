import { Box, Card, CardContent, IconButton, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '../App';
import { getAccessToken, getUserInfo } from '../utils/auth';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

interface PriceRow {
  readonly id: number;
  readonly article: string;
  readonly price: string;
}


export default function AdminPriceTable() {
  const [prices, setPrices] = useState<Array<PriceRow>>([])
  const [refresh, setRefresh] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const {userInfo} = useContext(UserInfoContext)
  const navigate = useNavigate()
  
  const columns: GridColDef[] = [
    { field: 'price', headerName: 'Prezzo', width: 120,
      renderCell: (params) => 
        <Typography>
          {"€ " + params.row.price}
        </Typography>
    },
    { field: 'article', headerName: 'Articolo', width: 600 },
    {
      field: 'actions', 
      headerName: 'Cancella', 
      width: 120, 
      sortable: false ,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton onClick={async () => {
              const accessToken = await getAccessToken()
              if (!accessToken)
                return;

              await axios.delete(
                'http://localhost:8000/api/prices',
                {
                  data: {
                    id: params.row.id
                  },
                  headers: {
                    'authorization': 'Bearer ' + accessToken
                  }
                })
                .then(_ => {
                  setRefresh(!refresh)
                })
                .catch(error => {
                  console.error(error);
                });
            }}>
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        )
      }
    },
  ];

  useEffect(() => {
    
    const fetchData = async () => {
      const userInfo = await getUserInfo()
      if (userInfo == null || !userInfo.isStaff)
        return navigate("/")

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
  }, [refresh]);

  if (!userInfo)
    return <></>

  return (
    <Card className="w-[90%] mx-auto m-2">
      <CardContent>
        <Box className="flex mb-4 justify-around">
          <TextField
            inputProps={{ maxLength: 100 }}
            id="articleField"
            label='Articolo'
            placeholder='Inserisci articolo' 
            variant="outlined"
            error={error}
            required
          />
          <TextField 
            id="priceField"
            label='Prezzo'
            placeholder='Inserisci prezzo' 
            error={error}
            InputProps={{ type:'number', inputProps: { min: 0 } }} 
          />
          <IconButton 
            className='!p-4'
            onClick={async () => {
              setError(false);
              const article = document.getElementById("articleField") as HTMLInputElement
              const price = document.getElementById("priceField") as HTMLInputElement
              
              const accessToken = await getAccessToken()
              if (!accessToken)
                return;

              await axios.post('http://localhost:8000/api/prices',
              {article: article.value, price: price.value},
              {
                headers: {
                  'authorization': 'Bearer ' + accessToken
                }
              })
              .then(response => {
                setPrices(response.data)
                setRefresh(!refresh)
              })
              .catch(_ => {
                setError(true);
              });
            }} 
          >
            <SaveIcon />
          </IconButton>
        </Box>
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
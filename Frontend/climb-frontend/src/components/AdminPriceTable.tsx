import { Box, Card, CardContent, IconButton, Input, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '../App';
import { getAccessToken, getUserInfo } from '../utils/auth';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

interface PriceRow {
  readonly id: number;
  readonly article: string;
  readonly price: string;
}


export default function AdminPriceTable() {
  const [prices, setPrices] = useState<Array<PriceRow>>([])
  const [editable, setEditable] = useState<number>(0)
  const {userInfo} = useContext(UserInfoContext)
  const navigate = useNavigate()
  
  const columns: GridColDef[] = [
    { field: 'price', headerName: 'Prezzo', width: 120 },
    { field: 'article', headerName: 'Articolo', width: 600 },
    {
      field: 'actions', 
      headerName: 'Azioni', 
      width: 120, 
      sortable: false ,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton onClick={() => setEditable(params.row.id)}>
              <EditIcon/>
            </IconButton>
            <IconButton>
              <DeleteIcon />
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

      const accessToken = await getAccessToken()
      if (!accessToken)
        return;

      // TODO get callback
      await axios.get('http://localhost:8000/api/users/',
        {
          headers: {
            'authorization': 'Bearer ' + accessToken
          }
        })
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

  if (!userInfo)
    return <></>

  return (
    <Card className="w-[90%] mx-auto m-2">
      <CardContent>
        <Box className="flex mb-4 justify-evenly">
          <TextField
            inputProps={{ maxLength: 100 }}
            id="articleField"
            label='Articolo'
            placeholder='Inserisci articolo' 
            variant="outlined"
            required
          />
          <TextField 
            id="priceField"
            label='Prezzo'
            placeholder='Inserisci prezzo' 
            InputProps={{ type:'number', inputProps: { min: 0 } }} 
          />
          <IconButton 
            className='!p-4'
            onClick={() => {
              const article = document.getElementById("articleField") as HTMLInputElement
              const price = document.getElementById("priceField") as HTMLInputElement
              
              // TODO saving callback
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
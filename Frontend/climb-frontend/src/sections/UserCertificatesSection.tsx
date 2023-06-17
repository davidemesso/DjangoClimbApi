import { Card, CardContent } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { BACKEND_URL } from '../utils/urls';
import { Link, useNavigate } from 'react-router-dom';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '../App';
import { getAccessToken, getUserInfo } from '../utils/auth';
import axios from 'axios';

interface UserRow {
  readonly id: string;
  readonly username: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly certificate_file: number;
  readonly expire_date: string;
}

function isExpired(expireDate : string) {
  const expired = (new Date(expireDate) < new Date())
  return expired
}

const columns: GridColDef[] = [
  { field: 'username', headerName: 'Username', width: 200 },
  { field: 'first_name', headerName: 'Nome', width: 180 },
  { field: 'last_name', headerName: 'Cognome', width: 180 },
  {
    field: 'certificate_file', 
    headerName: 'Certificato', 
    width: 200, 
    sortable: false ,
    renderCell: (params) =>
      {
        const cert = params.row.certificate_file
        const expire = params.row.expire_date

        if (!cert)
          return (
            <>
              <Brightness1Icon
                className={"text-red-500"} 
              />
              Nessun certificato
            </>
          )

        return <>
          <Brightness1Icon
            className={isExpired(expire) ? "text-yellow-400" : "text-green-500"} />
          <Link
            className='text-blue-500 ml-2 align-bottom'
            target='_blank'
            to={`${BACKEND_URL}/${cert}`}
          >
            Certificato medico
          </Link>
        </>;
      }
  },
  { field: 'expire_date', headerName: 'Scadenza', width: 120 },
];

export default function UserCertificatesSection() {
  const [users, setUsers] = useState<Array<UserRow>>([])
  const {userInfo} = useContext(UserInfoContext)
  const navigate = useNavigate()

  useEffect(() => {
    
    const fetchData = async () => {
      const userInfo = await getUserInfo()
      if (userInfo == null || !userInfo.isStaff)
        return navigate("/")

      const accessToken = await getAccessToken()
      if (!accessToken)
        return;

      await axios.get('http://localhost:8000/api/users/',
        {
          headers: {
            'authorization': 'Bearer ' + accessToken
          }
        })
        .then(response => {
          setUsers(response.data)
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
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </CardContent>
    </Card>
  );
}
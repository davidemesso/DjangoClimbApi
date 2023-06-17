import { Box } from "@mui/material";
import { useContext } from "react";
import { UserInfoContext } from "../App";
import AdminPriceTable from "../components/AdminPriceTable";

export default function PricesSection() {
  const {userInfo} = useContext(UserInfoContext);
  
  const component = (userInfo && userInfo.isStaff) 
    ? <AdminPriceTable />
    : <Box>TBELLA PREZI</Box> 

  return component
}
import { useContext } from "react";
import { UserInfoContext } from "../App";
import AdminPriceTable from "../components/AdminPriceTable";
import PriceTable from "../components/PriceTable";

export default function PricesSection() {
  const {userInfo} = useContext(UserInfoContext);
  
  const component = (userInfo && userInfo.isStaff) 
    ? <AdminPriceTable />
    : <PriceTable /> 

  return component
}
import { useContext } from 'react'
import { UserInfoContext } from '../App';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { userInfo } = useContext(UserInfoContext);
  const navigate = useNavigate()

  if (!userInfo) {
    navigate("/")
    return <></>
  }

  return (
    <div>{userInfo.username}</div>
  )
}
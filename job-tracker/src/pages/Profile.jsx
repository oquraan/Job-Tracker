import { Card, CardContent, CardHeader } from "@mui/material";
import { useSelector } from "react-redux";

export default function Profile() {
  const userInfo = useSelector((state) => state.UserInfo.user);

  // const info = JSON.parse(localStorage.getItem("info"));
  return (
    <>
<div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardHeader className="text-xl font-bold text-center">
            Profile Information
          </CardHeader>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">UID:</span>
            <span>{userInfo.uid}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{userInfo.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Username:</span>
            <span>{userInfo.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Phone:</span>
            <span>{userInfo.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Role:</span>
            <span className="capitalize">{userInfo.role}</span>
          </div>
        </CardContent>
      </Card>
    </div>    </>
  );
}

import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./css/DashBoard.css";
// import "../styles/applications-table.css";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../firebase";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
export default function Admin() {
  const statusColors = {
    applied: "primary",
    interview: "warning",
    offer: "success",
    rejected: "error",
  };

  const handleStatusChange = async (id, newStatus) => {
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    const appRef = doc(db, "jobApplications", id);
    await updateDoc(appRef, {
      status: newStatus,
      updatedAt: new Date(),
    });
  };
  // const userInfo = useSelector((state) => state.UserInfo.user);

  const [applications, setApplications] = useState([]);

  const handleDelete = async (id) => {
    setApplications(applications.filter((app) => app.id !== id));

    const docRef = doc(db, "jobApplications", id);

    await deleteDoc(docRef);
  };

  const handleUpdate = (id) => {
    const statusOrder = ["applied", "interview", "offer", "rejected"];
    setApplications(
      applications.map((app) => {
        if (app.id === id) {
          const currentIndex = statusOrder.indexOf(app.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...app, status: statusOrder[nextIndex] };
        }
        return app;
      })
    );
  };

  const userInfo = useSelector((state) => state.UserInfo.user);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  async function getAllApilicatioln() {
    // const userDoc = await getDoc(doc(db, " jobApplications"));

    const q = query(collection(db, "jobApplications"));
    // console.log(q);

    const querySnapshot = await getDocs(q);
    const apps = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdTime: doc.data().createdTime?.toDate(),
    }));

    setApplications(apps);
  }
  console.log(applications);
  useEffect(() => {
    getAllApilicatioln();
    // getAllApilicatioln();
  }, []);

  const [filterStatus, setFilterState] = useState("all");
  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);
  return (
    <>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardHeader
          title={
            <Typography variant="h6">
              Applications ({applications.length})
            </Typography>
          }
          sx={{ backgroundColor: "primary.main", color: "white" }}
        />
      
      
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {" "}
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => setFilterState("applied")}
              sx={{
                backgroundColor: "#3b82f6",
                color: "white",
                "&:hover": { backgroundColor: "#2563eb" },
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Applied
            </Button>

            <Button
              onClick={() => setFilterState("interview")}
              sx={{
                border: "2px solid #facc15",
                color: "#ca8a04",
                "&:hover": { backgroundColor: "#fef9c3" },
                borderRadius: "12px",
                textTransform: "none",
              }}
            >
              Interview
            </Button>

            <Button
              onClick={() => setFilterState("rejected")}
              sx={{
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                "&:hover": { backgroundColor: "#fecaca" },
                borderRadius: "12px",
                textTransform: "none",
              }}
            >
              Rejected
            </Button>

            <Button
              onClick={() => setFilterState("hired")}
              sx={{
                backgroundColor: "#22c55e",
                color: "white",
                "&:hover": { backgroundColor: "#16a34a" },
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Hired
            </Button>

            <Button
              onClick={() => setFilterState("all")}
              sx={{
                border: "2px solid #9ca3af",
                color: "#374151",
                "&:hover": { backgroundColor: "#f3f4f6" },
                borderRadius: "12px",
                textTransform: "none",
              }}
            >
              All
            </Button>
          </Stack>
        </div>

        <CardContent>
          {filteredApplications.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User Name</TableCell> {/* New column */}
                    <TableCell>Company</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.UserName}</TableCell>{" "}
                      {/* Display username */}
                      <TableCell>{app.company}</TableCell>
                      <TableCell>{app.position}</TableCell>
                      <TableCell>
                        <Select
                          value={app.status}
                          size="small"
                          onChange={(e) =>
                            handleStatusChange(app.id, e.target.value)
                          }
                          sx={{ minWidth: 100 }}
                        >
                          <MenuItem value="applied">Applied</MenuItem>
                          <MenuItem value="interview">Interview</MenuItem>
                          <MenuItem value="rejected">Rejected</MenuItem>
                          <MenuItem value="hired">Hired</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleUpdate(app.id)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(app.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: "center", p: 3, color: "text.secondary" }}>
              No applications found. Start applying to jobs!
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
}

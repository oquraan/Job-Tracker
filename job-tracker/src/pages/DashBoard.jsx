import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
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
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import JobAnalyzer from "../component/JobAnalyzer";
import ResumeHelper from "../component/ResumeHeIper";
import { db } from "../firebase";
import useSummary from "../hooks/useSummary";
import { MessageCircle, X, Send } from "lucide-react";
import ChatBox from "../component/chatBox";

export default function Dash() {
  const statusColors = {
    applied: "primary",
    interview: "warning",
    offer: "success",
    rejected: "error",
  };
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");

  const [applications, setApplications] = useState([]);
  const [textContent, setTextContents] = useState("");
  const { messages, sendMessage } = useSummary();
  const [isUploadeCV, setIsUploadCV] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  // const userInfo = JSON.parse(localStorage.getItem("info"));

  // eslint-disable-next-line react-hooks/exhaustive-deps

  async function getAllApilicatioln() {
    // const userDoc = await getDoc(doc(db, " jobApplications"));

    const q = query(
      collection(db, "jobApplications"),
      where("userId", "==", userInfo.uid)
    );
    // console.log(q);

    const querySnapshot = await getDocs(q);
    const apps = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdTime: doc.data().createdTime?.toDate(),
    }));

    setApplications(apps);
    console.log("ssssssssssssssssssssssssssssssss");
    console.log(apps);
    console.log("ssssssssssssssssssssssssssssssss");

    sendMessage(apps);
    // alert(messages);
    console.log(messages);
  }
  console.log(applications);
  useEffect(() => {
    getAllApilicatioln();
    // getAllApilicatioln();
  }, []);

  const [clickButton, setClickButton] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setClickButton(true);

    const newId = uuidv4();

    const formData = {
      company,
      position,
      status,
    };
    try {
      console.log(userInfo.username);
      await setDoc(doc(db, "jobApplications", newId), {
        uid: newId,
        company,
        position,
        status,
        userId: userInfo.uid,
        createdTime: serverTimestamp(),
        UserName: userInfo.username,
      });

      setCompany("");
      setPosition("");
      setStatus("applied");
      getAllApilicatioln();
      setClickButton(false);
    } catch (error) {
      console.error("Error adding application:", error);
    }
  }

  const [filterStatus, setFilterState] = useState("all");
  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);
  const assistantMessages = messages.filter((msg) => msg.role === "assistant");

  return (
    <>

 <button
      onClick={() => setIsOpen(true)}
        className={`chat-button ${isOpen ? "hidden" : ""}`}
      >
        <MessageCircle size={24} />
      </button>

<ChatBox isOpen={isOpen} setIsOpen={setIsOpen}></ChatBox>





    
      {" "}
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">Add Job Application</h2>
          <p className="form-subtitle">
            Enter the details of the job application.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="company" className="form-label">
                Company
              </label>
              <input
                id="company"
                className="form-input"
                placeholder="e.g., Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="position" className="form-label">
                Position
              </label>
              <input
                id="position"
                className="form-input"
                placeholder="e.g., Frontend Developer"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="applied">Applied</option>
                {/* <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option> */}
              </select>
            </div>
          </div>

          <button type="submit" className="form-button" disabled={clickButton}>
            Save Application
          </button>
        </form>
      </div>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardHeader
          className="card-object"
          title={
            <Typography variant="h6">
              Applications ({applications.length})
            </Typography>
          }
          sx={{ backgroundColor: "primary.main", color: "white" }}
        />

        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {" "}
          <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
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

        {/* 
  <button
          key={option.value}
          className={`filter-button ${selectedStatus === option.value ? "active" : ""}`}
          onClick={() => handleStatusChange(option.value)}
        >
          <span className="button-label">{option.label}</span>
          {statusCounts && <span className="count-badge">{statusCounts[option.value] || 0}</span>}
        </button> */}

        <CardContent>
          {applications.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Status</TableCell>
                    {/* <TableCell>Createdt Time </TableCell> */}

                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.company}</TableCell>
                      <TableCell>{app.position}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)
                          }
                          color={statusColors[app.status]}
                          size="small"
                        />
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
                      {/* <TableCell align="right">{app.createdTime}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* <div>{messages}</div>{" "} */}
              <div className="card-content">
                {assistantMessages.length > 0 && (
                  <div className="result-item">
                    <div className="result-text">
                      {assistantMessages[assistantMessages.length - 1].content
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line, index) => (
                          <p key={index} className="result-line">
                            {line}
                          </p>
                        ))}
                    </div>

                    <div className="assistant-footer">
                      <div className="assistant-indicator">
                        <div className="pulse-dot"></div>
                        Assistant Response
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: "center", p: 3, color: "text.secondary" }}>
              No applications found. Start applying to jobs!
            </Box>
          )}
        </CardContent>
      </Card>{" "}
      <ResumeHelper
        setTextContents={setTextContents}
        setIsUploadCV={setIsUploadCV}
      ></ResumeHelper>
      {isUploadeCV ? (
        <JobAnalyzer textContent={textContent}></JobAnalyzer>
      ) : null}
    </>
  );
}

import React, { useMemo } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { TStore } from "../../../../Redux/Store/Store";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { API_BASE_URL } from "../../../../Api/ApiConstant";
import { getAuthToken } from "../../../../Utils/cookieHelper";
import styles from './QuizList.module.css';

const columns: GridColDef[] = [
  { field: "sno", headerName: "S.no", width: 150 },
  { field: "col1", headerName: "Name", flex: 1 },
  { field: "col2", headerName: "No of questions", width: 150 },
  { field: "col3", headerName: "Created On", width: 150 }
];

type QuizListProps = {
  fetchQuizList: () => void;
  onEditQuiz: (id: string) => void;
  onViewQuizDetails: (id: string) => void;
};

const QuizList: React.FC<QuizListProps> = ({fetchQuizList, onEditQuiz, onViewQuizDetails}) => {
  const quiz = useSelector((state: TStore) => state.quiz);
  const quizListRows: GridRowsProp = useMemo(() => {
    return quiz.data.map((item, index) => ({
      id: item._id,
      sno: index + 1,
      col1: item.title,
      col2: item.questions.length,
      col3: new Date(item.createdAt).toLocaleDateString(),
    }));
  }, [quiz]);
  const onDeleteQuiz = async (id: string) => {
    const headers = {
      "X-Authorization": getAuthToken(),
    };
    try {
      await axios.delete(`${API_BASE_URL}/quiz/${id}`, { headers });
      fetchQuizList();
    } catch (error) {
      console.log(error);
    }
  };
  const renderDeleteButton = (params: any) => {
    const { id } = params.row;
    return (
      <Tooltip title="Delete">
        <IconButton color="error" onClick={() => onDeleteQuiz(id)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  };
  const renderEditButton = (params: any) => {
    const { id } = params.row;
    return (
      <Tooltip title="Edit">
        <IconButton color="primary" onClick={() => onEditQuiz(id)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    );
  };
  const renderViewButton = (params: any) => {
    const { id } = params.row;
    return (
      <Tooltip title="View Details">
        <IconButton sx={{ color: "#788681" }} onClick={() => onViewQuizDetails(id)}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    );
  };
  return (
    <div>
      <DataGrid
        rows={quizListRows}
        columns={[
          ...columns,
          {
            field: "view",
            headerName: "View",
            width: 80,
            sortable: false,
            renderCell: renderViewButton,
            disableColumnMenu: true
          },
          {
            field: "edit",
            headerName: "Edit",
            width: 80,
            sortable: false,
            renderCell: renderEditButton,
            disableColumnMenu: true
          },
          {
            field: "delete",
            headerName: "Delete",
            width: 80,
            sortable: false,
            renderCell: renderDeleteButton,
            
          },
        ]}
        rowSelection={false}
      />
    </div>
  );
};

export default QuizList;

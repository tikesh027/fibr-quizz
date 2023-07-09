import React, { useMemo } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { TStore } from "../../../../Redux/Store/Store";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { getAuthToken } from "../../../../Utils/cookieHelper";
import { API_BASE_URL } from "../../../../Api/ApiConstant";
import { requestQuestionList } from "../../../../Redux/Action/Question/QuestionAction";
import { TQuestionActionMode } from "../../QuestionBank";

const columns: GridColDef[] = [
  { field: "sno", headerName: "S.no", width: 150 },
  { field: "col1", headerName: "Question", flex: 1 },
  { field: "col2", headerName: "Created On", width: 150 },
];

type QuestionListProps = {
  fetchQuestionList: () => void;
  onViewQuestionDetails: (id: string) => void;
  onEditQuestionDetails: (id: string) => void;
  mode: TQuestionActionMode;
};

const QuestionList: React.FC<QuestionListProps> = ({
  fetchQuestionList,
  onViewQuestionDetails,
  onEditQuestionDetails,
  mode
}) => {
  const question = useSelector((state: TStore) => state.question);
  const questionListRows: GridRowsProp = useMemo(() => {
    return question.data.map((item, index) => ({
      id: item._id,
      sno: index + 1,
      col1: item.question,
      col2: new Date(item.createdAt).toLocaleDateString(),
    }));
  }, [question]);

  const onDeleteQuestion = async (id: string) => {
    if (!id) return;
    const headers = {
      "X-Authorization": getAuthToken(),
    };
    try {
      await axios.delete(`${API_BASE_URL}/question/${id}`, { headers });
      fetchQuestionList();
    } catch (error) {
      console.log(error);
    }
  };

  const renderDeleteButton = (params: any) => {
    const { id } = params.row;
    return (
      <Tooltip title="Delete">
        <IconButton color="error" onClick={() => onDeleteQuestion(id)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  };
  const renderEditButton = (params: any) => {
    const { id } = params.row;
    return (
      <Tooltip title="Edit">
        <IconButton color="primary" onClick={() => onEditQuestionDetails(id)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    );
  };
  const renderViewButton = (params: any) => {
    const { id } = params.row;
    return (
      <Tooltip title="View Details">
        <IconButton sx={{ color: "#788681" }} onClick={() => onViewQuestionDetails(id)}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <div>
      <DataGrid
        rows={questionListRows}
        columns={[
          ...columns,
          {
            field: "view",
            headerName: "View",
            width: 80,
            sortable: false,
            renderCell: renderViewButton,
            disableColumnMenu: true,
          },
          {
            field: "edit",
            headerName: "Edit",
            width: 80,
            sortable: false,
            renderCell: renderEditButton,
            disableColumnMenu: true,
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

export default QuestionList;

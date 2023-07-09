import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  TextField,
  Tooltip,
} from "@mui/material";
import { TQuestionActionMode } from "../../QuestionBank";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";

type OptionProps = {
  handleOptionText: (text: string) => void;
  handleCorrectOption: () => void;
  isCorrectOption: boolean;
  optionText: string;
  optionNumber: number;
  isValid: boolean;
  id: number;
  deleteOption: (id: number) => void;
  totalNoOfOptions: number;
  mode: TQuestionActionMode;
};

const Option: React.FC<OptionProps> = ({
  handleCorrectOption,
  handleOptionText,
  isCorrectOption,
  optionText,
  optionNumber,
  isValid,
  id,
  deleteOption,
  totalNoOfOptions,
  mode,
}) => {
  if (mode === "View") {
    return (
      <ListItem disablePadding>
        <ListItemIcon sx={{ color: isCorrectOption ? "green" : "red", minWidth: '35px' }}>
          {isCorrectOption ? <DoneIcon /> : <ClearIcon />}
        </ListItemIcon>
        <ListItemText primary={optionText} />
      </ListItem>
    );
  }
  return (
    <Box display="flex" gap="5px" alignItems="center" width="100%">
      <Radio
        color="success"
        checked={isCorrectOption}
        onChange={handleCorrectOption}
        sx={{
          color: isCorrectOption ? undefined : "red",
        }}
        size="small"
      />
      <TextField
        label={`Option ${optionNumber}`}
        variant="outlined"
        value={optionText}
        onChange={(e) => handleOptionText(e.target.value)}
        type="text"
        fullWidth
        size="small"
        inputProps={{ style: { fontSize: "16px" } }}
        helperText={!isValid ? "Please enter valid text" : ""}
        error={!isValid}
        color={isCorrectOption ? "success" : undefined}
      />
      <IconButton
        disabled={totalNoOfOptions === 1}
        size="small"
        onClick={() => deleteOption(id)}
      >
        <DeleteIcon color={totalNoOfOptions === 1 ? "disabled" : "error"} />
      </IconButton>
    </Box>
  );
};

export default Option;

import React from "react";
import Radio from "@mui/material/Radio";
import styles from "./QuestionStructure.module.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

const QuestionStructure = () => {
  const [selectedValue, setSelectedValue] = React.useState("a");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  return (
    <div>
      <div className={styles.container}>
        <div>
          <div className={styles.title}>Brew Your Question Here....</div>
          <TextField
            id="standard-basic"
            label="Write Your Question Here..."
            variant="standard"
            className={styles.question}
          />
        </div>
        <div>
          <div className={styles.options}>
            <Radio {...controlProps("a")} className={styles.radioButton} />
            <TextField
              id="standard-basic"
              label="Option 1"
              variant="standard"
            />
          </div>
          <div className={styles.options}>
            <Radio
              {...controlProps("b")}
              color="error"
              className={styles.radioButton}
            />
            <TextField
              id="standard-basic"
              label="Option 2"
              variant="standard"
              color="primary"
            />
          </div>
          <div className={styles.options}>
            <Radio
              {...controlProps("c")}
              color="success"
              className={styles.radioButton}
            />
            <TextField
              id="standard-basic"
              label="Option 3"
              variant="standard"
            />
          </div>
          <div className={styles.options}>
            <Radio
              {...controlProps("d")}
              color="default"
              className={styles.radioButton}
            />
            <TextField
              id="standard-basic"
              label="Option 4"
              variant="standard"
            />
          </div>
          <div className={styles.saveButton}>
            <Button variant="contained" className={styles.button}>Save Question</Button>
            <Button variant="contained" className={styles.button}>New Question</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionStructure;

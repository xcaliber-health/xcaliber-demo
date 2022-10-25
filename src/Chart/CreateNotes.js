import { Grid, Typography } from "@mui/material";

const CreateNotes = ({}) => {
  return (
    <Grid container>
      <Grid item container pt={2}>
        <Grid item>
          <Typography variant="h4">{`Create Notes`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default CreateNotes;

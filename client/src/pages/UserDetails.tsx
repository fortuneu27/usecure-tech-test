import { useQuery, useMutation } from '@apollo/client';
import { Alert, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useParams } from 'react-router';
import type { CourseResult } from '../types/courseResult.type';
import { enqueueSnackbar } from 'notistack';
import { DELETE_COURSE_RESULT } from '../queries/courseResults.query';
import { useState } from 'react';
import { UserForm } from '../forms/UserForm';
import { CourseResultForm } from '../forms/CourseResultForm';
import { GET_USER_DETAILS } from '../queries/user.query';


export const UserDetails = () => {
  document.title = "User Details - Usecure Tech Test";
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_USER_DETAILS, {
    variables: { id },
    fetchPolicy: 'cache-first'
  });

  const [deleteCourseResult, { error: deleteError, data: deleteData }] = useMutation(DELETE_COURSE_RESULT, {
    refetchQueries: [GET_USER_DETAILS]
  });
  const [openUserForm, setOpenUserForm] = useState(false);
  const [openCourseResultForm, setOpenCourseResultForm] = useState(false);
  const [currentResult, setCurrentResult] = useState<CourseResult | undefined>(undefined);

  if (loading) return <p>Loading...</p>;
  if (error) {
    enqueueSnackbar(`Error fetching user details: ${error.message}`, { variant: 'error' });
    return null;
  }
  if (!data || !data.user) {
    enqueueSnackbar(`User with id ${id} not found`, { variant: 'error' });
    return null;
  }
  if (deleteData?.deleteCourseResult) {
    enqueueSnackbar('Course result deleted successfully', { variant: 'success' });
  }

  const user = data.user;

  if (deleteError) return enqueueSnackbar(`Error deleting course result: ${deleteError.message}`, { variant: 'error' });
  const handleDeleteCourseResult = (courseResultId: string) => async () => {
    if (window.confirm("Are you sure you want to delete this course result?")) {
      await deleteCourseResult({ variables: { id: courseResultId } });
    }
  }

  const handleOpenUserForm = () => setOpenUserForm(true);
  const handleCloseUserForm = () => setOpenUserForm(false);

  const handleOpenCourseResultForm = (result?: CourseResult) => {
    setOpenCourseResultForm(true);
    if(result) setCurrentResult(result)
  };
  const handleCloseCourseResultForm = () => {
    setOpenCourseResultForm(false);
    setCurrentResult(undefined);
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      <Grid container spacing={2}>
        <Grid size={8}>
          <h2>{user.firstName} {user.lastName}</h2>
          <p>Email: {user.email}</p>
        </Grid>
        <Grid size={4}>
          <Button variant="contained" onClick={handleOpenUserForm} color="primary">
            Edit User
          </Button>
        </Grid>
        <Grid size={8}>
          <h3>Course Results</h3>
        </Grid>
        <Grid size={4}>
          <Button variant="contained" onClick={() => handleOpenCourseResultForm()} color="primary">
            Add Course Result
          </Button>
        </Grid>
        <Grid size={12}>
          {user.courseResults.length === 0 ? <Alert severity="info">No course results found for this user.</Alert>
          : <List>
            {user.courseResults.map((result: CourseResult) => {
            const labelId = `courseResult-list-label-${result.id}`;
            
            return (
              <ListItem key={result.id}
              secondaryAction={
                  <Button variant="contained" onClick={handleDeleteCourseResult(result.id)} color="error">
                    Delete
                  </Button>
              }
              disablePadding
            >
              <ListItemButton role={undefined} onClick={() => handleOpenCourseResultForm(result)} dense>
                <ListItemText id={labelId} primary={result.name} secondary={`Score: ${result.score}`} />
              </ListItemButton>
            </ListItem>
            );
          })}
          </List>}
        </Grid>
      </Grid>
      <Dialog
        open={openUserForm}
        onClose={handleCloseUserForm}
      >
        <DialogTitle>Update User</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <DialogContentText>
            To update this user, please enter the new details here.
          </DialogContentText>
          <UserForm finished={handleCloseUserForm} user={user} />
        </DialogContent>
      </Dialog>
      <Dialog
        open={openCourseResultForm}
        onClose={handleCloseCourseResultForm}
      >
        <DialogTitle>{currentResult ? 'Update' : 'Create'} Course Result</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <DialogContentText>
            To {currentResult ? 'update' : 'create'} this course result, please enter the new details here.
          </DialogContentText>
          <CourseResultForm finished={handleCloseCourseResultForm} courseResult={currentResult} learnerId={user.id} />
        </DialogContent>
      </Dialog>
    </>
  );
}

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Alert, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Grid , List, ListItem, ListItemButton, ListItemText, TablePagination } from '@mui/material';
import type { User } from '../types/user.type';
import { useNavigate } from "react-router";
import { enqueueSnackbar } from 'notistack';
import { DELETE_USER, GET_USERS } from '../queries/user.query';
import { UserForm } from '../forms/UserForm';


export const UserList = () => {
  document.title = "User List - Usecure Tech Test";

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  let navigate = useNavigate();
  const handleView = (id: string) => () => {
    navigate(`/user/${id}`);
  };

  const { loading, error, data, fetchMore } = useQuery(GET_USERS, {
    fetchPolicy: 'cache-first',
    variables: {
      offset: (page - 1) * rowsPerPage,
      limit: rowsPerPage
    }
  });

  useEffect(() => {
    if (error) enqueueSnackbar(`Error fetching users: ${error.message}`, { variant: 'error' });
  }, [error]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
    fetchMore({
      variables: {
        offset: newPage * rowsPerPage,
        limit: rowsPerPage
      }
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newRows = parseInt(event.target.value, 10);
    setRowsPerPage(newRows);
    setPage(1);
    fetchMore({
      variables: {
        offset: 0,
        limit: newRows
      }
    });
  };

  const [deleteUser, { error: deleteError, data: deleteData }] = useMutation(DELETE_USER, {
    refetchQueries: [GET_USERS],
  });

  useEffect(() => {
    if (deleteData?.data) enqueueSnackbar('User deleted successfully', { variant: 'success' });
  }, [deleteData]);

  useEffect(() => {
    if (deleteError) enqueueSnackbar(`Error deleting user: ${deleteError.message}`, { variant: 'error' });
  }, [deleteError]);

  const handleDelete = (id: string) => async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser({ variables: { id } });
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {loading && <p>Loading...</p>}
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid size={8}>
          <h2>User List</h2>
        </Grid>
        <Grid size={4}>
          <Button variant="contained" onClick={handleOpen} color="primary">
            Create User
          </Button>
        </Grid>
        <Grid size={12}>
          {!data || !data.users || data.users.users.length === 0 ? (
            <Alert severity="info">No users found, create a user.</Alert>
          ) : (
            <>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {data.users.users.map((user: User) => {
                  const labelId = `user-list-label-${user.id}`;
                  return (
                    <ListItem
                      key={user.id}
                      secondaryAction={
                        <Button variant="contained" onClick={handleDelete(user.id)} color="error">
                          Delete
                        </Button>
                      }
                      disablePadding
                    >
                      <ListItemButton role={undefined} onClick={handleView(user.id)} dense>
                        <ListItemText id={labelId} primary={`${user.firstName} ${user.lastName}`} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
              <TablePagination
                component="div"
                count={data.users.totalCount}
                page={page - 1}
                onPageChange={(e, newPage) => handleChangePage(e, newPage + 1)}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogTitle>Create User</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <DialogContentText>
            To create a new user, please enter the details here.
          </DialogContentText>
          <UserForm finished={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

// Handle the creating and updating course results in a popup/modal

import { AppBar, CssBaseline, Toolbar, Typography } from "@mui/material";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { BrowserRouter, Route, Routes, Link } from "react-router";
import { UserList } from "../pages/UserList";
import { UserDetails } from "../pages/UserDetails";


export default function Router() {
  return (
    <BrowserRouter>
      <SnackbarProvider maxSnack={3} autoHideDuration={5000} action={(snackbarId) => (
        <button onClick={() => closeSnackbar(snackbarId)}>
          Dismiss
        </button>
      )}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, cursor: "pointer", color: "inherit", textDecoration: "none" }}>
              Home
            </Typography>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/user/:id" element={<UserDetails />} />
        </Routes>
      </SnackbarProvider>
    </BrowserRouter>
  );
}

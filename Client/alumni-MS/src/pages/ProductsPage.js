import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Grid,
  TextField,
  Alert,
} from '@mui/material';
// components
import Drawer from '@mui/material/Drawer';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import { ENDPOINT } from './LoginPage';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Position', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Location', alignRight: false },
  { id: 'isVerified', label: 'Description', alignRight: false },
  { id: 'status', label: 'Created At', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function JobPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const [currentTarget, setCurrentTarget] = useState({});

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const [myRows, setMyRows] = useState([]);
  const token = localStorage.getItem('token');

  const myFetch = async () => {
    const res = await fetch(`${ENDPOINT}/api/jobs/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      console.log(data.error);
      return;
    }

    const myData = data.filter((item) => item.is_approved === false);
    setMyRows(myData);
  };

  useEffect(() => {
    myFetch();
  }, []);

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const [sstate, setSstate] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleSDrawer = (anchor, open) => (event) => {
    handleCloseMenu();
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setSstate({ ...sstate, [anchor]: open });
  };

  const [data, setData] = useState({
    position: '',
    company: '',
    location: '',
    description: '',
  });
  const [succ, setSucc] = useState(false);
  const [myId, setMyId] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDia, setOpenDia] = useState(false);
  return (
    <>
      <Helmet>
        <title> Jobs | Alumni Management System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Jobs
          </Typography>

          {user &&
            !user.is_student &&
            ['bottom'].map((anchor) => (
              <React.Fragment key={anchor}>
                <Button variant="contained" onClick={toggleDrawer(anchor, true)}>
                  New
                </Button>

                <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                  <Grid container direction="column" alignItems="flex-start" sx={{ padding: '0.44rem 2rem' }}>
                    <h1>Add A New Job</h1>
                  </Grid>
                  <Stack spacing={3} sx={{ padding: '0.44rem 2rem', width: '95%' }}>
                    <TextField
                      name="Position"
                      label="Position"
                      value={data.position}
                      onChange={(e) => setData({ ...data, position: e.target.value })}
                    />

                    <TextField
                      name="Location"
                      label="Company"
                      value={data.company}
                      onChange={(e) => setData({ ...data, company: e.target.value })}
                    />
                    <TextField
                      name="Location"
                      label="Location"
                      value={data.location}
                      onChange={(e) => setData({ ...data, location: e.target.value })}
                    />
                    <TextField
                      name="Description"
                      label="Description"
                      value={data.description}
                      onChange={(e) => setData({ ...data, description: e.target.value })}
                      multiline
                    />
                    {isError && <Alert severity="error">{errorMessage}</Alert>}
                    {succ && <Alert severity="success">Job Added Successfully</Alert>}
                    <Button
                      variant="contained"
                      onClick={async (e) => {
                        e.preventDefault();
                        const res = await fetch(`${ENDPOINT}/api/jobs/new`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify(data),
                        });
                        const Rdata = await res.json();
                        if (!res.ok) {
                          setIsError(true);
                          setErrorMessage(Rdata.error);
                          console.log(Rdata);
                          return;
                        }
                        setSucc(true);
                        toggleDrawer(anchor, false);
                        myFetch();
                      }}
                    >
                      Save
                    </Button>
                  </Stack>
                </Drawer>
              </React.Fragment>
            ))}
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {Array.isArray(myRows) && myRows.length
                    ? myRows.map((row) => {
                      const { _id, position, company, location, description, created_at } = row;
                      const selectedUser = selected.indexOf(position) !== -1;

                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {position}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{company}</TableCell>

                          <TableCell align="left">{location}</TableCell>

                          <TableCell align="left">{description}</TableCell>

                          <TableCell align="left">
                            <Label color={'success'}>
                              {sentenceCase(
                                `${`${new Date(created_at).getDate()}-${new Date(created_at).getMonth()}-${new Date(
                                  created_at
                                ).getFullYear()}`}`
                              )}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={(e) => {
                                if (user && user.is_student) {
                                  setCurrentTarget(row);
                                  setOpenDia(true);
                                  return;
                                }
                                setCurrentTarget(row);
                                setMyId(_id);
                                handleOpenMenu(e);
                              }}
                            >
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                    : null}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {user && user.is_admin && (
          <MenuItem
            onClick={async () => {
              const res = await fetch(`${ENDPOINT}/api/jobs/update/${myId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  is_approved: true,
                }),
              });

              const data = await res.json();
              if (!res.ok) {
                console.log(data.error);
                return;
              }
              myFetch();
            }}
          >
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Approve
          </MenuItem>
        )}

        {user && user.is_alumni && (
          <>
            {['bottom'].map((anchor) => (
              <React.Fragment key={anchor}>
                <MenuItem onClick={toggleSDrawer(anchor, true)}>
                  <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                  Edit Job
                </MenuItem>

                <Drawer anchor={anchor} open={sstate[anchor]} onClose={toggleSDrawer(anchor, false)}>
                  <Grid container direction="column" alignItems="flex-start" sx={{ padding: '0.44rem 2rem' }}>
                    <h1>Edit Job</h1>
                  </Grid>
                  <Stack spacing={3} sx={{ padding: '0.44rem 2rem', width: '95%' }}>
                    <TextField
                      name="Position"
                      label="Position"
                      value={currentTarget.position}
                      onChange={(e) => setCurrentTarget({ ...currentTarget, position: e.target.value })}
                    />

                    <TextField
                      name="Location"
                      label="Company"
                      value={currentTarget.company}
                      onChange={(e) => setCurrentTarget({ ...currentTarget, company: e.target.value })}
                    />
                    <TextField
                      name="Location"
                      label="Location"
                      value={currentTarget.location}
                      onChange={(e) => setCurrentTarget({ ...currentTarget, location: e.target.value })}
                    />
                    <TextField
                      name="Description"
                      label="Description"
                      value={currentTarget.description}
                      onChange={(e) => setCurrentTarget({ ...currentTarget, description: e.target.value })}
                      multiline
                    />
                    {isError && <Alert severity="error">{errorMessage}</Alert>}
                    {succ && <Alert severity="success">Job Updated Successfully</Alert>}
                    <Button
                      variant="contained"
                      onClick={async (e) => {
                        e.preventDefault();
                        const res = await fetch(`${ENDPOINT}/api/jobs/update/${myId}`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify(currentTarget),
                        });
                        const Rdata = await res.json();
                        if (!res.ok) {
                          setIsError(true);
                          setErrorMessage(Rdata.error);
                          console.log(Rdata);
                          return;
                        }
                        setSucc(true);
                        toggleSDrawer(anchor, false);
                        myFetch();
                      }}
                    >
                      Save
                    </Button>
                  </Stack>
                </Drawer>
              </React.Fragment>
            ))}

            <MenuItem
              sx={{ color: 'error.main' }}
              onClick={async () => {
                const res = await fetch(`${ENDPOINT}/api/jobs/delete/${myId}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                });
                if (!res.ok) {
                  console.log('error');
                  return;
                }
                myFetch();
                handleCloseMenu();
              }}
            >
              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
              Delete
            </MenuItem>
          </>
        )}
      </Popover>
      <Dialog
        open={openDia}
        onClose={() => setOpenDia(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Job Details'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ padding: '0.44rem 2rem', width: '95%' }}>
            <TextField
              name="Position"
              label="Position"
              value={currentTarget.position ? currentTarget.position : ''}
              disabled
            />

            <TextField
              name="Location"
              label="Company"
              value={currentTarget.company ? currentTarget.company : ''}
              disabled
            />
            <TextField
              name="Location"
              label="Location"
              value={currentTarget.location ? currentTarget.location : ''}
              disabled
            />
            <TextField
              name="Description"
              label="Description"
              value={currentTarget.description ? currentTarget.description : ''}
              multiline
              disabled
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDia(false)} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

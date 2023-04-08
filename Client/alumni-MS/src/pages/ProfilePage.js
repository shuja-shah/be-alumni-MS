import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
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
  Box,
  Grid,
  TextField,
  Alert,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import { ENDPOINT } from './LoginPage';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Last Name', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
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

const ChangeDp = ({ myFetch }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [avatarUpload, setAvatarUpload] = useState(false);
  const [dataLoading, setDataLoading] = useState(!Boolean(currentUser));
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await fetch(`${ENDPOINT}/api/users/upload`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data);
      return false;
    }
    console.log(data, 'dp CHanged');
    myFetch();
  };

  return (
    <article
      style={
        !avatarUpload
          ? {
              width: '300px',
              height: '170px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#f5f5f5',
              borderRadius: '8px',
              border: 'none',
              marginLeft: '2rem',
              padding: '1rem',
              gap: '3rem',
            }
          : {
              /* go a little dark and show icons */
              width: '300px',
              height: '170px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '8px',
              border: 'none',
              marginLeft: '2rem',
              padding: '1rem',
              gap: '3rem',
              position: 'relative',
            }
      }
      onMouseOver={() => setAvatarUpload(true)}
      onMouseLeave={() => setAvatarUpload(false)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {!avatarUpload && (
          <Avatar
            sx={{
              width: '80px',
              height: '80px',
            }}
            src={currentUser.avatar ? currentUser.avatar : ''}
          >
            {!dataLoading ? currentUser.first_name[0] : 'E'}
          </Avatar>
        )}
      </div>
      {avatarUpload && (
        <label>
          <CameraAltIcon
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '3rem',
              color: '#fff',
              cursor: 'pointer',
            }}
          />
          <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange(e)} />
        </label>
      )}
    </article>
  );
};

export default function MyProfile() {
  const [open, setOpen] = useState(null);
  const [formData, setFormData] = useState({});

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [succ, setSucc] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [myId, setMyId] = useState('');
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const [myRows, setMyRows] = useState([]);
  const token = localStorage.getItem('token');

  const myFetch = async () => {
    const res = await fetch(`${ENDPOINT}/api/users/self`, {
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
    setFormData(data);
  };

  useEffect(() => {
    myFetch();
  }, []);

  return (
    <>
      <Helmet>
        <title> My Profile | Alumni Management System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            My Profile
          </Typography>
        </Stack>

        <Card>
          {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
          <Scrollbar>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <ChangeDp myFetch={myFetch} />
              </Grid>
              <Grid item>
                <Stack spacing={0} sx={{ padding: '0.44rem 2rem', width: '95%', gap: '1rem' }}>
                  First Name
                  <TextField
                    name="First Name"
                    // label="First Name"
                    value={formData.first_name}
                    onChange={(e) => {
                      setFormData({ ...formData, first_name: e.target.value });
                    }}
                  />
                  Last Name
                  <TextField
                    name="Last Name"
                    // label="Last Name"
                    value={formData.last_name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        last_name: e.target.value,
                      });
                    }}
                  />
                  Email
                  <TextField
                    name="Email"
                    // label="Email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      });
                    }}
                  />
                  {formData.is_alumni && (
                    <>
                      Resume
                      <input type="file" name="resume" label="Upload Resume" />
                    </>
                  )}
                  {isError && <Alert severity="error">{errorMessage}</Alert>}
                  {succ && <Alert severity="success">Your Details Were Saved</Alert>}
                  <Button
                    variant="contained"
                    onClick={async (e) => {
                      e.preventDefault();
                      const res = await fetch(`${ENDPOINT}/api/users/${formData._id}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          first_name: formData.first_name,
                          last_name: formData.last_name,
                          email: formData.email,
                        }),
                      });
                      const Rdata = await res.json();
                      if (!res.ok) {
                        setIsError(true);
                        setErrorMessage(Rdata.error);
                        console.log(Rdata);
                        return;
                      }
                      setSucc(true);

                      myFetch();
                    }}
                  >
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
}

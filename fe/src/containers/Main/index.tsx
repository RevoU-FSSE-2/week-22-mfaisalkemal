import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';

import { useCallback, useContext, useEffect } from 'react';

import { AppContext } from '../../contexts/AppProvider';
import { useTokenChecker } from '../../hooks';
import { BASE_URL } from '../../configs/Constants';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';

interface Column {
  id: 'name' | 'task' | 'priority' | 'due' | 'actions';
  label: string;
  minWidth?: number;
  formatNumber?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'task', label: 'Task', minWidth: 170 },
  { id: 'priority', label: 'Priority', minWidth: 100 },
 
  {
    id: 'due',
    label: 'Due',
    minWidth: 170,
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170
  }
];

interface Data {
  key: number;
  id: number;
  // users_name: string;
  task: string;
  priority: string;
  due: string;
}

interface getDataResponse {
  data: Data[]
}

interface DataSubset {
  id: number;
  // name: string;
  task: string;
  priority: string;
  due: string;
}

interface CategoryData {
  key: number;
  id: number;
  // name: string;
  task: string;
  priority: string;
  due: string;
}


function createData(data: CategoryData): DataSubset {

  return {
    id: data?.id,
    // name: data?.name,
    task: data?.task,
    priority: data?.priority,
    due: data?.due,
  };
}

const Main: React.FC = () => {
  const { categories, setCategories } = useContext(AppContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useTokenChecker(token)
  const showNotification = useNotification();


  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getCategoryList = useCallback(
    async () => {
      const fetching = await fetch(BASE_URL + '/todo/get', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const response: getDataResponse = await fetching.json();

      const categorizedData = response.data ? response.data.map(data => ({
        ...data,
        key: data.id
      })) : [];

      const transformedData = categorizedData.map((data, index) => ({
        key: index,
        id: data.id,
        task: data.task,
        priority: data.priority,
        due: data.due,
      }));

      setCategories(transformedData ?? []);
    },
    [setCategories, token]
  )

  useEffect(
    () => {
      getCategoryList()
    },
    [getCategoryList]
  )

  const handleEditClick = (taskId: number) => {
    navigate(`/edit/${taskId}`)
    // Perform your edit action here
    // You can use setLoading(false) after the edit is complete
  };

  const handleDeleteClick = async (taskId: number) => {
    try {
      const fetching = await fetch(BASE_URL + '/todo/delete/' + taskId, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!fetching.ok) {
        throw new Error('Error deleting category');
      }

      showNotification('success', 'Task Deleted', 'Task deleted successfully');

      getCategoryList();
    } catch (error) {
      showNotification('error', 'Task Not Deleted', 'Task failed to be deleted');
    }
  };

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/');
  }

  const rows = categories.map((data) => createData(data));

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/add')}
      >
        Add New Item
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() => logout()}
      >
        Logout
      </Button>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: DataSubset) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {column.id === 'actions' ? (
                          <div>
                            <IconButton onClick={() => handleEditClick(row.id)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteClick(row.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        ) : (
                          // Render the cell value based on the column.id
                          column.id === 'name'
                            ? row.name
                            : column.id === 'task'
                              ? row.task
                              : column.id === 'priority'
                                ? row.priority
                                : column.id === 'due'
                                  ? row.due
                                  : ''
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>

        </Table>

      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default Main
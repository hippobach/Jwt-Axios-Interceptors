import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { API_ROOT } from '~/utils/constants';
import authorizedAxiosInstance from '~/utils/authorizedAxios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await authorizedAxiosInstance.get(
        `${API_ROOT}/v1/dashboards/access`
      );
      setUser(res.data);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    // Với trường hợp dùng localStorage thì chỉ cần xóa thông tin user trong localStorage phía FE
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    // Với trường hợp dùng httpOnlyCookie thì sẽ gọi api để remove cookies
    await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`);
    setUser(null);
    // Cuối cùng là điều hướng tới trang login sau khi logout thành công
    navigate('/login');
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh',
        }}
      >
        <CircularProgress />
        <Typography>Loading dashboard user...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: '100vw',
        marginTop: '1em',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '0 1em',
      }}
    >
      <Alert
        severity="info"
        sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}
      >
        Đây là trang Dashboard sau khi user:&nbsp;
        <Typography
          variant="span"
          sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}
        >
          {user?.email}
        </Typography>
        &nbsp; đăng nhập thành công thì mới cho truy cập vào.
      </Alert>

      <Button
        type="button"
        variant="contained"
        color="info"
        size="large"
        sx={{
          mt: 2,
          maxWidth: 'min-content',
          alignSelf: 'flex-end',
        }}
        onClick={handleLogout}
      >
        Log Out
      </Button>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}

export default Dashboard;

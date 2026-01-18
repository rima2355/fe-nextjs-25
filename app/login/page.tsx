'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Stack,
} from '@mui/material';
// Hapus import icon MUI yang error, misal: 
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import Email from '@mui/icons-material/Email';
// import Lock from '@mui/icons-material/Lock';
// Gunakan icon pengganti berbasis SVG sendiri:
const Visibility = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5Zm0 13A5.5 5.5 0 1 1 17.5 12A5.5 5.5 0 0 1 12 17.5Zm0-9A3.5 3.5 0 1 0 15.5 12A3.5 3.5 0 0 0 12 8.5Z" fill="currentColor"/>
  </svg>
);
const VisibilityOff = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <path d="M17.94 17.94a10.42 10.42 0 0 1-5.94 1.56c-5 0-9.27-3.11-11-7.5A12.88 12.88 0 0 1 6.31 6.34M9.53 9.53A3.49 3.49 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.49 3.49 0 0 1-.98 2.47M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const Email = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="m22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const Lock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 17v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
// ganti 'signIn' dengan 'signInService' jika memang implementasi login memakai itu
import { signInService } from '@/services/services';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Record<string, boolean>>({});

  const [token, setToken] = useState(Cookies.get('token') || '');
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsError((prevError) => ({ ...prevError, [name]: false }));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData = new FormData(e.currentTarget);

      const response = await signInService(submitData);
      if (response.error) {
        if (response.message == 'Token has expired') {
          Cookies.remove('token');
          router.push('/');
        } else if (response.message) {
          if (typeof response.message === 'object') {
            Object.entries(response.message).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                setIsError((prevError) => ({ ...prevError, [key]: true }));
                console.log(value[0]);
              }
            });
          } else {
            console.log(response.message);
          }
        }
      } else {
        const token = response.data.data.token;
        const tokenBase64 = btoa(token);
        Cookies.set('token', tokenBase64, { expires: 1 });
        console.log(response.data.message);
        router.push('/');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      console.log(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-md bg-gray-800 text-white shadow-2xl border border-gray-700">
        <CardContent className="p-8">
          <Box className="flex flex-col items-center mb-8">
            <div className="bg-indigo-600 p-3 rounded-xl mb-4 shadow-lg shadow-indigo-500/20">
              <Lock className="text-white text-3xl" />
            </div>
            <Typography variant="h4" className="font-bold text-white mb-2">
              Welcome Back
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              Please enter your details to sign in
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                error={isError.email}
                onChange={handleChange}
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                variant="standard"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email className="text-gray-500" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiInput-root': {
                    color: 'white',
                    fontFamily: 'inherit',
                    '&:before': { borderBottomColor: '#374151' },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottomColor: '#6366f1',
                    },
                    '&:after': { borderBottomColor: '#6366f1' },
                  },
                  '& .MuiInput-input': {
                    color: 'black',
                  },
                  '& .MuiInputLabel-root': { color: '#9ca3af' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
                }}
              />

              <Box>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  variant="standard"
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock className="text-gray-500" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            className="text-gray-500"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiInput-root': {
                      color: 'white',
                      fontFamily: 'inherit',
                      '&:before': { borderBottomColor: '#374151' },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: '#6366f1',
                      },
                      '&:after': { borderBottomColor: '#6366f1' },
                    },
                    '& .MuiInput-input': {
                      color: 'black',
                    },
                    '& .MuiInputLabel-root': { color: '#9ca3af' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
                  }}
                />
                <Box className="flex justify-end mt-2">
                  <MuiLink
                    href="#"
                    className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors underline-none"
                  >
                    Forgot password?
                  </MuiLink>
                </Box>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                className="bg-indigo-600 hover:bg-indigo-700 py-3 text-lg font-bold shadow-lg shadow-indigo-500/30 normal-case rounded-xl transition-all duration-300"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </form>

          <Box className="mt-8 pt-6 border-t border-gray-700 text-center">
            <Typography variant="body2" className="text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
              >
                Sign up free
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
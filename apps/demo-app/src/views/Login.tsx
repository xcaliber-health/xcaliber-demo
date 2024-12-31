'use client'

// React Imports
import type { FormEvent } from 'react'
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { signIn } from 'next-auth/react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

// Type Imports

import type { Mode } from '@core/types'

// Component Imports
import Logo from '@/components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'
import GoogleSignInButton from '@/components/GoogleSignInButton'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Util Imports

const LoginV1 = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const router = useRouter()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // router.push('/')
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='!p-12'>
          <div className='flex justify-center items-center gap-3 mbe-6'>
            <Logo />
          </div>
          <div className='flex flex-col gap-5'>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
            </div>
            <form noValidate autoComplete='off' onSubmit={e => handleLogin(e)} className='flex flex-col gap-5'>
              {/* <TextField autoFocus fullWidth label='Email' />
              <TextField
                fullWidth
                label='Password'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <FormControlLabel control={<Checkbox />} label='Remember me' />
                <Typography className='text-end' color='primary' component={Link} href={'/'}>
                  Forgot password?
                </Typography>
              </div>
              <Button fullWidth variant='contained'>
                Log In
              </Button> */}
              <GoogleSignInButton
                onClick={() =>
                  signIn('google', {
                    callbackUrl: '/'
                  })
                }
              />
              {/* <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>New on our platform?</Typography>
                <Typography component={Link} href={'/'} color='primary'>
                  Create an account
                </Typography>
              </div> */}
              <Divider className='gap-3'>or</Divider>
              <div className='flex justify-center items-center gap-2'>
                <IconButton className='text-facebook'>
                  <i className='ri-facebook-fill' />
                </IconButton>
                <IconButton className='text-twitter'>
                  <i className='ri-twitter-fill' />
                </IconButton>
                <IconButton className='text-github'>
                  <i className='ri-github-fill' />
                </IconButton>
                <IconButton className='text-googlePlus'>
                  <i className='ri-google-line' />
                </IconButton>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default LoginV1

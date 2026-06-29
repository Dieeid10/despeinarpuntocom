'use client'
import React from 'react';
import {
    TextField,
    Button,
    FilledInput,
    InputAdornment,
    IconButton,
    InputLabel,
    FormControl
} from '@mui/material';
import { Password, Visibility, VisibilityOff } from '@mui/icons-material';
import { usersServices } from '@/services/users';
import { useRouter } from 'next/navigation'

export const Form = () => {
    const router = useRouter()
    const filledPasswordId = React.useId();
    const [showPassword, setShowPassword] = React.useState(false)
    const [dataLogin, setDataLogin] = React.useState({
        username: '',
        password: '',
        loading: false,
        error: null as string | null
    })

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataLogin({
            ...dataLogin,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDataLogin((prevState) => ({ ...prevState, loading: true, error: null }))

        const formData = new FormData(e.currentTarget)
        const formDataEntries = Object.fromEntries(formData)
        
        const result = await usersServices.login({
            username: formDataEntries['username'] as string,
            password: formDataEntries['password'] as string
        })

        if (!result.success || !result.data?.token) {
            setDataLogin((prevState) => ({
                ...prevState,
                loading: false,
                error: result.message,
            }))

            return
        }

        const setCookie = await fetch('/api/set-cookie', {
            method: 'POST',
            body: JSON.stringify({ token: result.data.token })
        })
        const { redirect } = await setCookie.json()
        router.push(redirect)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='h-[60%] w-[30%] flex flex-col justify-center items-center gap-10 bg-white rounded-2xl'
        >
            <header>
                <h1
                    className='text-indigo-500 text-3xl'
                >Despeinar Turismo</h1>
                <h2
                    className='text-indigo-300'
                >Sistema de gestión interna</h2>
            </header>
            <div
                className='flex flex-col gap-5'
            >
                <TextField
                    type='text'
                    id="username"
                    name="username"
                    label="Usuario"
                    variant="filled"
                    onChange={handleChange}
                    required
                />
                <FormControl variant="filled">
                    <InputLabel htmlFor={`${filledPasswordId}-input`}>Contraseña</InputLabel>
                    <FilledInput
                        id={`${filledPasswordId}-input`}
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        required
                    />
                </FormControl>
            </div>
            <Button
                type='submit'
                variant="contained"
            >
                Ingresar
            </Button>
        </form>
    )
}
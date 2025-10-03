import { zodResolver } from "@hookform/resolvers/zod";
import { LockOpen } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import TextInput from "src/app/shared/components/TextInput";
import { useAccount } from "src/lib/hooks/useAccount";
import { registerSchema, type RegisterSchema } from "src/lib/schemas/registerSchema";


export default function RegisterForm() {
    const {registerUser} = useAccount();
    const {control, handleSubmit,setError, formState:{isValid, isSubmitting}} = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver : zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterSchema) => {
        await registerUser.mutateAsync(data, {
            onError: (error) => {
               if(Array.isArray(error))
               {
                    error.forEach(err => {
                        if(err.includes('Email')) setError('email', {message: err});
                        else if(err.includes('Pa$$w0rd')) setError('password', {message:err})
                    })
               }
            }
        });
    }
  return (
    <Paper 
        component='form' 
        onSubmit={handleSubmit(onSubmit)} 
        sx={{
            display:'flex',
            flexDirection: 'column',
            p: 3,
            gap: 3,
            mx: 'auto',
            borderRadius:3 
        }}
    >
        <Box display='flex' alignItems='center' justifyContent='center' gap={3} color='secondary.main'>
            <LockOpen fontSize="large" />
            <Typography variant="h4">Register</Typography>

        </Box>
        <TextInput label='Email' control={control} name="email"/> 
        <TextInput label='DisplayName' control={control} name="displayName"/> 
        <TextInput label='Password' type = 'password' control={control} name="password"/> 
        <Button type="submit" disabled={!isValid || isSubmitting} variant="contained" size="large">Register</Button>
        <Typography sx={{textAlign: 'center'}}>Already have an account?
                <Typography sx={{ml:2}} component={Link} to='/login' color="primary">
                    Sign In
                </Typography>
        </Typography>

    </Paper>
  )
}

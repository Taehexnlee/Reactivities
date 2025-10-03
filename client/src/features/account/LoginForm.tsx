import { zodResolver } from "@hookform/resolvers/zod";
import { LockOpen } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import TextInput from "src/app/shared/components/TextInput";
import { useAccount } from "src/lib/hooks/useAccount";
import { loginSchema, type LoginSchema } from "src/lib/schemas/loginSchema";


export default function LoginForm() {
    const {loginUser} = useAccount();
    const navigate = useNavigate();
    const location = useLocation();
    const {control, handleSubmit, formState:{isValid, isSubmitting}} = useForm<LoginSchema>({
        mode: 'onTouched',
        resolver : zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data, {
            onSuccess: () => {
                navigate(location.state?.form || '/activities');
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
            <Typography variant="h4">Sign IN</Typography>

        </Box>
        <TextInput label='Email' control={control} name="email"/> 
        <TextInput label='Password' type = 'password' control={control} name="password"/> 
        <Button type="submit" disabled={!isValid || isSubmitting} variant="contained" size="large">Login</Button>
        <Typography sx={{textAlign: 'center'}}>Don't have an account?
                <Typography sx={{ml:2}} component={Link} to='/register' color="primary">
                    Sign up
                </Typography>
        </Typography>

    </Paper>
  )
}

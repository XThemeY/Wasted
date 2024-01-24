import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RegisterValidation } from '@/utils/validation';
import Loader from '@/components/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '@/store/slices/';
import { useEffect } from 'react';
import { useAppSelector } from '@/hooks/redux';

const RegisterForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { isLogedIn } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (isLogedIn) {
      navigate('/');
    }
  }, [navigate, isLogedIn]);

  const form = useForm<z.infer<typeof RegisterValidation>>({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterValidation>) {
    try {
      await register(values);
      navigate('/login');
    } catch (e) {
      toast({
        variant: 'error',
        title: e?.data?.message || 'Ошибка!',
      });
    }
  }

  return (
    <Form {...form}>
      <div className="flex-center sm:w-520 flex-col rounded-2xl border-2 border-solid border-white px-5 py-3 backdrop-blur-lg">
        <img
          className="mt-4"
          src="/assets/images/WASTED.pro.png"
          alt="logo"
          width={250}
          height={36}
        />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-6">
          Create a new account
        </h2>
        <p className="small-medium md:base-regular mt-2 text-light-3 ">
          To use WastedPro, please enter your account details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 flex w-full flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isLoading ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              'Sign up'
            )}
          </Button>
          <p className="small-regular mt-2 text-center text-light-2">
            Already have an account?
            <Link to="/login" className="small-semibold ml-1 text-primary-500">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default RegisterForm;

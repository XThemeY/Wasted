import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginValidation } from '@/lib/validation';
import Loader from '@/components/shared/Loader';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const { toast } = useToast();
  const isLoading = false;
  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit() {
    // values: z.infer<typeof LoginValidation>
    // const user = await loginToAccount(values);
    await axios
      .post('/auth/login', form.getValues())
      .then((res) => console.log('Response', res))
      .catch((res) => {
        toast({
          variant: 'success',
          title: res.response.data.message,
        });
      });
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
          Login to your account
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

          <div className="small-regular flex justify-end ">
            <Link className="hover:underline" to="/forgot">
              Forgot password
            </Link>
          </div>
          <Button type="submit" className="shad-button_primary">
            {isLoading ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              'Log in'
            )}
          </Button>
          <p className="small-regular mt-2 text-center text-light-2">
            Don't have an account?
            <Link
              to="/registration"
              className="small-semibold ml-1 text-primary-500"
            >
              Create
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default LoginForm;

'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@org/ui-components';
import { signin } from '../../../lib/auth/actions';

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SigninFormData = z.infer<typeof signinSchema>;

interface SigninFormProps {
  prefilledEmail: string | null;
}

export default function SigninForm({ prefilledEmail }: SigninFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: prefilledEmail || '',
      password: '',
    },
  });

  const onSubmit = async (data: SigninFormData) => {
    startTransition(async () => {
      const result = await signin(data.email, data.password);

      if (result.success) {
        // Redirect to callback URL or home page
        const callbackUrl = searchParams.get('callbackUrl') || '/';
        router.push(callbackUrl);
        router.refresh();
      } else {
        form.setError('root', { message: result.error });
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          {prefilledEmail
            ? 'Your session expired. Please sign in again.'
            : 'Enter your email and password to sign in'}
        </CardDescription>
      </CardHeader>
      <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <CardContent>
          <FieldGroup>
            {form.formState.errors.root && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}

            {prefilledEmail && (
              <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
                Your session has expired. Please sign in again to continue.
              </div>
            )}

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signin-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="signin-password">Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    {...field}
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="current-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" form="signin-form" className="w-full" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

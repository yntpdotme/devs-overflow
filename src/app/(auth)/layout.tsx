const AuthLayout = ({children}: Readonly<{children: React.ReactNode}>) => {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-auth-light bg-cover bg-center bg-no-repeat px-4 py-10 dark:bg-auth-dark">
      {children}
    </main>
  );
};

export default AuthLayout;

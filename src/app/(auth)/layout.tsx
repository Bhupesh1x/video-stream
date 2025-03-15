type Props = {
  children: React.ReactNode;
};

function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;

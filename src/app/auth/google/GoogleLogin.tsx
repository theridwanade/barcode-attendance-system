import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const GoogleLogin = () => {
  const { signIn } = useSignIn();
  if (!signIn) return null;
  const handleGoogleLogin = async () => {
    return await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/dashboard",
      redirectUrlComplete: "/dashboard",
    });
  };
  return (
    <Button
      variant="outline"
      className="w-full cursor-pointer"
      onClick={handleGoogleLogin}
    >
      Login with Google
    </Button>
  );
};

export default GoogleLogin;

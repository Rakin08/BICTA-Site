import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a1a1a 0%, #0a0a0a 70%)' }}
    >
      <div className="w-full max-w-sm px-4">
        {/* Wordmark */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <span className="font-display font-medium text-[#faf8f3] text-2xl tracking-tight">BICTA</span>
          <span className="w-px h-5 bg-[#c9a84c]" />
          <span className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#c9a84c]">ELITE</span>
        </div>

        <Card className="bg-[#1a1a1a] border-[rgba(201,168,76,0.2)]">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display font-medium text-[#faf8f3] text-xl">
              Welcome Back
            </CardTitle>
            <p className="font-body font-light text-[0.875rem] text-[#8a8680] mt-1">
              Sign in to your BICTA Elite account
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <Button
              className="w-full bg-[#c9a84c] text-[#0a0a0a] hover:bg-[#e8d49a] font-body font-medium uppercase tracking-[0.08em]"
              size="lg"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              Continue with Kimi
            </Button>
            <p className="font-body font-light text-[0.75rem] text-[#8a8680] text-center mt-4">
              Secure authentication powered by Kimi OAuth
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <a href="/" className="font-body font-medium text-[0.8125rem] text-[#8a8680] hover:text-[#c9a84c] transition-colors duration-200">
            &larr; Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

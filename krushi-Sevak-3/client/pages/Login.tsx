import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/site/i18n";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate("/");
      } else {
        setError(t.login_error || "Invalid username or password");
      }
    } catch (err) {
      setError(t.login_error || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-lime-50 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-emerald-100/60 bg-white p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-md bg-gradient-to-br from-emerald-500 to-lime-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight text-emerald-900">{t.login_title || "Login"}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.login_subtitle || "Sign in to your account"}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">
                {t.login_username || "Username"}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.login_username_placeholder || "e.g., farmer"}
                className="w-full rounded-md border border-emerald-100/80 bg-white px-4 py-2 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">
                {t.login_password || "Password"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.login_password_placeholder || "Enter your password"}
                className="w-full rounded-md border border-emerald-100/80 bg-white px-4 py-2 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 text-white shadow-lg hover:scale-[1.01] transition-transform"
            >
              {isLoading ? (t.login_loading || "Logging in...") : (t.login_button || "Login")}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-emerald-100/40">
            <p className="text-xs text-center text-muted-foreground mb-3">{t.login_demo_hint || "Demo Credentials:"}</p>
            <div className="space-y-2 text-xs bg-emerald-50/50 rounded-md p-3 border border-emerald-100/40">
              <p><span className="font-medium text-emerald-700">User:</span> <code className="bg-white px-2 py-1 rounded border border-emerald-100">farmer</code></p>
              <p><span className="font-medium text-emerald-700">Pass:</span> <code className="bg-white px-2 py-1 rounded border border-emerald-100">password123</code></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

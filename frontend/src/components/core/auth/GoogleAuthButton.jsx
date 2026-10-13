import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaGithub } from "react-icons/fa";
import { googleLogin } from "../../../services/operations/authAPI";

// Google's own button is capped at 400px wide, so everything lines up to this.
const BUTTON_WIDTH = 320;

/**
 * Social sign-in buttons.
 *
 * Props
 *  - accountType:       "Student" | "Instructor" (passed through to the backend)
 *  - providers:         which buttons to show, default ["google"].
 *                       Add "github" when you're ready: providers={["google", "github"]}
 *  - githubClientId:    your GitHub OAuth app's client id (required for GitHub)
 *  - githubRedirectUri: defaults to `${origin}/auth/github/callback`
 */
export default function GoogleAuthButton({
  accountType,
  providers = ["google"],
  githubClientId,
  githubRedirectUri,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const startGithubLogin = () => {
    if (!githubClientId) {
      toast.error("GitHub sign-in isn't configured yet");
      return;
    }

    // `state` protects the callback against forged requests; the callback
    // page should compare it with what we stash here before using the code.
    const state =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()) + Math.random().toString(36).slice(2);

    try {
      sessionStorage.setItem("oauth_state", state);
      if (accountType) sessionStorage.setItem("oauth_account_type", accountType);
    } catch {
      toast.error("Please enable browser storage to sign in with GitHub");
      return;
    }

    const params = new URLSearchParams({
      client_id: githubClientId,
      redirect_uri: githubRedirectUri ?? `${window.location.origin}/auth/github/callback`,
      scope: "read:user user:email",
      state,
    });

    window.location.assign(`https://github.com/login/oauth/authorize?${params}`);
  };

  const showGoogle = providers.includes("google");
  const showGithub = providers.includes("github");

  if (!showGoogle && !showGithub) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      {showGoogle && (
        <div className="flex justify-center" style={{ width: BUTTON_WIDTH }}>
          <GoogleLogin
            onSuccess={(res) =>
              dispatch(googleLogin(res.credential, accountType, navigate))
            }
            onError={() => toast.error("Google sign-in failed")}
            theme="filled_black"
            shape="pill"
            text="continue_with"
            size="large"
            width={String(BUTTON_WIDTH)}
          />
        </div>
      )}

      {showGithub && (
        <button
          type="button"
          onClick={startGithubLogin}
          style={{ width: BUTTON_WIDTH }}
          className={`group flex h-10 max-w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] text-[13px] text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:bg-[#ffb454]/10 hover:text-[#ffb454] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ffb454]/20 active:scale-[0.98]`}
        >
          <FaGithub className="h-4 w-4" />
          <span className="font-medium">Continue with GitHub</span>
        </button>
      )}
    </div>
  );
}
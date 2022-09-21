import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import Loading from "../components/Loading";
import Login from "../components/Login";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "../store/store";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <Loading />;

  if (!user) return <Login />;

  return (
    <Provider store={store}>
      <Toaster />

      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;

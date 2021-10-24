import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
import { fromFetch } from "rxjs/fetch";
import { mergeMap } from "rxjs/operators";

type GithubStatusModel = {
  message: string;
};

type GithubModel = {
  current_user_url: string;
};

const getDetail = (id: string = "") => {
  const observable2 = fromFetch(`https://api.github.com/${id}`);
  return observable2
}

const useFetchObservableGithubStatus = () => {
  const [response, setResponse] = useState<GithubModel>();
  useEffect(() => {
    const observable = fromFetch("https://api.github.com/status");
    const subscription = observable
      .pipe(
        mergeMap((res) => {
          const githubStatus: Promise<GithubStatusModel> = res.json();
          return githubStatus;
        }),
        mergeMap((res) => {
          console.log("POND result from 1 API: ", res.message);
          return getDetail();
        }),
        mergeMap((res) => res.json())
      )
      .subscribe(
        (res: GithubModel) => {
          console.log(res.current_user_url);
          setResponse(res);
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return response;
};

function App() {
  const githubResponse = useFetchObservableGithubStatus()
  console.log("POND githubResponse: ", githubResponse)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

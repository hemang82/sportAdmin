import { BrowserRouter } from "react-router-dom";
import Router from './Router/index';
import DisableSelectionStyle from "./component/DisabledBrowser/DisableSelectionStyle";
// import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
// import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';

function App() {
  return (
    <>
      <DisableSelectionStyle disable={true} />
      <BrowserRouter basename="/">
        <Router />
      </BrowserRouter>
    </>
  );
}

export default App;
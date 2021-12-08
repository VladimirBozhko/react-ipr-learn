import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AppForm, AppFormFields} from "./components/app-form";
import {AppData} from "./components/app-data";
import {useAppStore} from "./hooks/use-app-store";

function App() {
  const store = useAppStore();

  const handleSubmit = (appFormFields: AppFormFields) => {
    store.appFormFields = appFormFields;
    const {dateRange, markers, options} = appFormFields;
    store.loadAppData(dateRange, markers, options);
  }

  return (
    <div className="m-2">
      <div className="row">
        <div className="col-4">
          <AppForm onSubmit={handleSubmit}/>
        </div>
        <div className="col">
          <AppData/>
        </div>
      </div>
    </div>
  );
}

export default App;

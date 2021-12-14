import React from "react";
import {observer} from "mobx-react-lite";
import {useAppStore} from "./hooks/use-app-store";
import {useNavigate, useParams} from "react-router-dom";
import {TravelRoute} from "./models/travel-route";
import {AppForm} from "./components/app-form";
import {AppRouteData} from "./components/app-route-data";
import {v4} from "uuid";

export const AppEdit = observer(() => {
  const store = useAppStore();
  const navigate = useNavigate();

  const {uuid} = useParams<'uuid'>();

  if (uuid && store.getRoute(uuid) === undefined) {
    navigate('/');
    return null;
  }

  const model = uuid ? store.getRoute(uuid) : {uuid: v4()} as Partial<TravelRoute>;

  const handleSubmit = (route: TravelRoute) => {
    store.addOrUpdateRoute(route);
    store.loadData(route.uuid);
    navigate('/edit/' + route.uuid);
  }

  return (
    <div className="m-2">
      <div className="row">
        <div className="col-4">
          <AppForm model={model} onSubmit={handleSubmit} onBack={() => navigate('/')}/>
        </div>
        <div className="col">
          {model?.data && <AppRouteData data={model.data}/>}
        </div>
      </div>
    </div>
  );
});


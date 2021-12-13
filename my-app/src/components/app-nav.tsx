import {NavLink, useNavigate} from "react-router-dom";
import React from "react";
import {useAppStore} from "../hooks/use-app-store";
import {observer} from "mobx-react-lite";

export const AppNav = observer(() => {
  const store = useAppStore();
  const navigate = useNavigate();

  const navLinkActive = ({isActive}: {isActive: boolean}) => "nav-link" + (isActive ? " active" : "");

  const onDelete = (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      store.deleteRoute(uuid);
    }
  };

  return (
    <div className="row m-2">
      <nav>
        <ul className="nav flex-column m-2">
          {store.routes.map((route, index) => (
            <li key={index} className="nav-item d-flex justify-content-between m-1">
              <NavLink className={navLinkActive} to={`edit/${route.uuid}`}>
                {route.startTitle} - {route.endTitle}
              </NavLink>
              <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => onDelete(route.uuid)}>
                Delete
              </button>
            </li>
            )
          )}
        </ul>
      </nav>
      <button className="btn btn-primary" type="button" onClick={() => navigate('/create')}>Add</button>
    </div>
  );
});
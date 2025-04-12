import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Calendar from './components/Calendar';
import Sidebar from './components/Sidebar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './styles/App.css';

function App() {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <div className="app">
          <Sidebar />
          <Calendar />
        </div>
      </DndProvider>
    </Provider>
  );
}

export default App;

import ReactDOM from 'react-dom/client';

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './sections/configureStore';
import { Provider } from "react-redux";

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <App />
    </Provider>);

serviceWorker.unregister();
// reportWebVitals();

import { createRoot } from "react-dom/client";

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './sections/configureStore';


// ----------------------------------------------------------------------

const root = createRoot(document.getElementById('root'));

root.render(
    
        <App />
    // </Provider>
    );

serviceWorker.unregister();
// reportWebVitals();

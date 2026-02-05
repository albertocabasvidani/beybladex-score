// Monorepo entry point - redirects to mobile package
import { registerRootComponent } from 'expo';
import App from './packages/mobile/App';

registerRootComponent(App);

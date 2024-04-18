import BetterSwitch from './components/BetterSwitch';
import CommonAccordion from './components/CommonAccordion';
import ConfirmationDialog from './components/ConfirmationDialog';
import EditableTypography from './components/EditableTypography';
import ImageGallery from './components/ImageGallery';
import Navbar from './components/Navbar';
import PageContainer from './components/PageContainer';
import PasswordField from './components/PasswordField';
import ResponsiveTabs from './components/ResponsiveTabs';
import Toast from './components/Toast';
import AuthenticationContext from './contexts/AuthenticationContext';
import PageNameProvider from './contexts/PageNameProvider';
import PaletteModeContext from './contexts/PaletteModeContext';
import { useDebounce, useDeviceFeatures } from './hooks';
import DefaultLayout from './layouts/DefaultLayout';
import LayoutProvider from './layouts/LayoutProvider';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

export {
  AuthenticationContext,
  BetterSwitch,
  CommonAccordion,
  ConfirmationDialog,
  DefaultLayout,
  EditableTypography,
  ImageGallery,
  LayoutProvider,
  Navbar,
  PageContainer,
  PageNameProvider,
  PaletteModeContext,
  PasswordField,
  ResponsiveTabs,
  Toast,
  useDebounce,
  useDeviceFeatures,
};

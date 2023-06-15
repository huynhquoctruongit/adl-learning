import ThemeMenuUnit from './linear';
import PracticeTheme from './practice';
import ToastProvider from '../../context/toast';

const mapTheme = {
  PracticeTheme,
  ThemeMenuUnit
};

const Default = ({ children }) => {
  return children;
};

const Theme = ({ children, theme }) => {
  const ThemeWrap = mapTheme[theme] || Default;
  return (
    <ToastProvider>
      <ThemeWrap>
        <div className="w-full">{children}</div>
      </ThemeWrap>
    </ToastProvider>
  );
};

export default Theme;

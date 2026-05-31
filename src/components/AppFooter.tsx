import type { ReactNode } from 'react';
import { getCopyrightText } from '../constants/branding';
import './app-footer.css';

type AppFooterProps = {
  children?: ReactNode;
};

const AppFooter = ({ children }: AppFooterProps) => {
  return (
    <footer className="app-footer">
      {children != null && (
        <div className="app-footer__actions">{children}</div>
      )}
      <p className="app-footer__copyright">{getCopyrightText()}</p>
    </footer>
  );
};

export default AppFooter;

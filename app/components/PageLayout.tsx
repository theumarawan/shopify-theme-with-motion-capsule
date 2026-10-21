interface PageLayoutProps { children?: React.ReactNode; [key: string]: unknown }
export function PageLayout({children = null}: PageLayoutProps) {
  return <div id="main-content">{children}</div>;
}

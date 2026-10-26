import { Link, useLocation } from '@tanstack/react-router';
import type { ReactNode, MouseEventHandler } from 'react';

type SiteLinkProps = { to: string; hash?: string; end?: boolean; children?: ReactNode; className?: string | undefined; onClick?: MouseEventHandler<HTMLAnchorElement>; 'aria-label'?: string };
export function SiteLink({ to, hash, end: _end, ...props }: SiteLinkProps) {
  const [path = '/', query] = to.split('?');
  const search = Object.fromEntries(new URLSearchParams(query || ''));
  return <Link to={path} search={() => search} {...(hash ? { hash } : {})} {...props} />;
}
export function SiteNavLink({ to, end, className, ...props }: SiteLinkProps) {
  const pathname = useLocation({ select: location => location.pathname });
  const active = end ? pathname === to : pathname === to || pathname.startsWith(to + '/');
  return <SiteLink to={to} className={[className, active ? 'active' : ''].filter(Boolean).join(' ')} {...props} />;
}
export function useSiteLocation() {
  return useLocation({ select: location => ({ pathname: location.pathname, search: location.searchStr }) });
}
export function useSiteSearchParams() {
  const location = useSiteLocation();
  return [new URLSearchParams(location.search)] as const;
}

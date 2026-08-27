export type ServiceIconName = 'home' | 'apply' | 'track' | 'fix' | 'renew' | 'replace' | 'certificate' | 'notice' | 'map' | 'help'

export function ServiceIcon({ name, className = '' }: { name: ServiceIconName; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  return <svg className={`service-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {name === 'home' && <><path {...common} d="m4 10 8-6 8 6v9.5H4z" /><path {...common} d="M9 19.5v-5h6v5" /></>}
    {name === 'apply' && <><path {...common} d="M6 3.5h8l4 4V20.5H6z" /><path {...common} d="M14 3.5v4h4M9 12h6M9 16h4" /></>}
    {name === 'track' && <><circle {...common} cx="12" cy="12" r="8.5" /><path {...common} d="M12 7v5l3.5 2M4.5 5.5 7 3.5" /></>}
    {name === 'fix' && <><path {...common} d="M13.5 6.5 17.5 3a4 4 0 0 1-5 5L6 14.5 4 20l5.5-2 6.5-6.5" /><path {...common} d="m4.5 18.5 1 1" /></>}
    {name === 'renew' && <><path {...common} d="M19 8V3.5l-2 2A8 8 0 1 0 19.4 14" /><path {...common} d="M19 3.5h-4.5" /></>}
    {name === 'replace' && <><rect {...common} x="4" y="6" width="12" height="9" rx="1.5" /><path {...common} d="M8 18h12V9M7 10h3M7 12.5h5" /></>}
    {name === 'certificate' && <><path {...common} d="M6 3.5h12v12H6zM9 7h6M9 10h6" /><path {...common} d="m9 15.5-1 5 4-2 4 2-1-5" /></>}
    {name === 'notice' && <><path {...common} d="M5 5h14v14H5zM8 9h8M8 12h8M8 15h5" /><path {...common} d="M8 2.5v5M16 2.5v5" /></>}
    {name === 'map' && <><path {...common} d="m3.5 6 5-2.5 7 2.5 5-2.5v14L15.5 20l-7-2.5-5 2.5z" /><path {...common} d="M8.5 3.5v14M15.5 6v14" /></>}
    {name === 'help' && <><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M9.8 9a2.3 2.3 0 1 1 3.3 2.1c-.8.4-1.1.9-1.1 1.9M12 16.5h.01" /></>}
  </svg>
}

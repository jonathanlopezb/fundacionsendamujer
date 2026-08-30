import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

// 1. Defensoría del Pueblo Colombia
export const DefensoriaLogo: React.FC<LogoProps> = ({ className = "w-12 h-12", size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Shield Base */}
    <path d="M50 8L85 22V50C85 71.5 69.8 89.2 50 95C30.2 89.2 15 71.5 15 50V22L50 8Z" fill="#0A192F" stroke="#E2E8F0" strokeWidth="2"/>
    <path d="M50 12L81 24.5V50C81 68.8 67.8 84.3 50 89.5C32.2 84.3 19 68.8 19 50V24.5L50 12Z" fill="#1E293B"/>
    
    {/* Colombia Tricolor Top Ribbon */}
    <path d="M30 24H70V29H30V24Z" fill="#FACC15"/>
    <path d="M30 29H70V32.5H30V29Z" fill="#1D4ED8"/>
    <path d="M30 32.5H70V36H30V32.5Z" fill="#DC2626"/>
    
    {/* Balance Scales of Justice */}
    <path d="M50 40V68M36 68H64" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M34 46H66" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
    
    {/* Left Scale Pan */}
    <path d="M34 46L26 58H42L34 46Z" fill="#FBBF24" fillOpacity="0.4" stroke="#F59E0B" strokeWidth="1.5"/>
    {/* Right Scale Pan */}
    <path d="M66 46L58 58H74L66 46Z" fill="#FBBF24" fillOpacity="0.4" stroke="#F59E0B" strokeWidth="1.5"/>
    
    {/* Center Pillar Cap */}
    <circle cx="50" cy="40" r="3.5" fill="#FACC15"/>
    
    {/* Text Label */}
    <text x="50" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="7 font-weight=900" fontFamily="sans-serif" fontWeight="bold" letterSpacing="0.5">DEFENSORÍA</text>
    <text x="50" y="86" textAnchor="middle" fill="#F3F4F6" fontSize="5 font-weight=700" fontFamily="sans-serif" letterSpacing="0.3">DEL PUEBLO</text>
  </svg>
);

// 2. Fiscalía General de la Nación (CAIVAS)
export const FiscaliaCaivasLogo: React.FC<LogoProps> = ({ className = "w-12 h-12", size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Dark Hexagonal Badge */}
    <path d="M50 5L88 27V73L50 95L12 73V27L50 5Z" fill="#0F172A" stroke="#3B82F6" strokeWidth="2"/>
    <path d="M50 9L84 29.5V70.5L50 91L16 70.5V29.5L50 9Z" fill="#1E1B4B"/>
    
    {/* Eagle Wing Graphic */}
    <path d="M25 35C35 30 45 35 50 42C55 35 65 30 75 35C68 45 58 48 50 55C42 48 32 45 25 35Z" fill="#F59E0B"/>
    
    {/* Pillar of Justice */}
    <rect x="46" y="44" width="8" height="24" rx="2" fill="#E0E7FF"/>
    <rect x="42" y="42" width="16" height="4" rx="1" fill="#93C5FD"/>
    <rect x="42" y="68" width="16" height="4" rx="1" fill="#93C5FD"/>
    
    {/* Shield emblem */}
    <circle cx="50" cy="54" r="5" fill="#312E81" stroke="#F59E0B" strokeWidth="1.5"/>
    
    {/* CAIVAS Ribbon */}
    <rect x="24" y="74" width="52" height="12" rx="6" fill="#DC2626"/>
    <text x="50" y="82.5" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.5">CAIVAS</text>
  </svg>
);

// 3. Profamilia Colombia
export const ProfamiliaLogo: React.FC<LogoProps> = ({ className = "w-12 h-12", size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Circle Container */}
    <circle cx="50" cy="50" r="45" fill="#831843" stroke="#F472B6" strokeWidth="2"/>
    <circle cx="50" cy="50" r="41" fill="#500724"/>
    
    {/* Vibrant Interlocking Flower/Heart Emblem */}
    <path d="M50 22C38 22 28 32 28 44C28 58 50 78 50 78C50 78 72 58 72 44C72 32 62 22 50 22Z" fill="#E12880" fillOpacity="0.85"/>
    <path d="M50 28C41 28 34 35 34 44C34 54 50 70 50 70C50 70 66 54 66 44C66 35 59 28 50 28Z" fill="#F43F5E"/>
    
    {/* Intertwined Second Heart */}
    <path d="M50 34C44 34 39 39 39 45C39 52 50 63 50 63C50 63 61 52 61 45C61 39 56 34 50 34Z" fill="#FBBF24"/>
    
    {/* Text Label */}
    <rect x="18" y="74" width="64" height="13" rx="6.5" fill="#E12880"/>
    <text x="50" y="83" textAnchor="middle" fill="#FFFFFF" fontSize="7 font-weight=900" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.8">PROFAMILIA</text>
  </svg>
);

// 4. ICBF (Instituto Colombiano de Bienestar Familiar)
export const IcbfLogo: React.FC<LogoProps> = ({ className = "w-12 h-12", size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Green Rounded Square */}
    <rect x="8" y="8" width="84" height="84" rx="24" fill="#064E3B" stroke="#34D399" strokeWidth="2"/>
    <rect x="12" y="12" width="76" height="76" rx="20" fill="#047857"/>
    
    {/* Family Tree Leaves Canopy */}
    <circle cx="50" cy="36" r="18" fill="#10B981"/>
    <circle cx="38" cy="40" r="12" fill="#34D399"/>
    <circle cx="62" cy="40" r="12" fill="#34D399"/>
    
    {/* Family Silhouettes (Adult & Child) holding hands */}
    {/* Adult 1 */}
    <circle cx="42" cy="48" r="4" fill="#FDE047"/>
    <path d="M36 66V56C36 53.8 38.2 52 41 52C43.8 52 46 53.8 46 56V66" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round"/>
    
    {/* Child in Center */}
    <circle cx="50" cy="52" r="3" fill="#FFFFFF"/>
    <path d="M46 66V60C46 58.3 47.8 57 50 57C52.2 57 54 58.3 54 60V66" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>

    {/* Adult 2 */}
    <circle cx="58" cy="48" r="4" fill="#FDE047"/>
    <path d="M54 66V56C54 53.8 56.2 52 59 52C61.8 52 64 53.8 64 56V66" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round"/>
    
    {/* ICBF Text Pill */}
    <rect x="22" y="72" width="56" height="12" rx="6" fill="#065F46" stroke="#A7F3D0" strokeWidth="1"/>
    <text x="50" y="80.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="sans-serif" fontWeight="900" letterSpacing="1">ICBF</text>
  </svg>
);

// 5. ONU Mujeres (UN Women)
export const OnuMujeresLogo: React.FC<LogoProps> = ({ className = "w-12 h-12", size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* UN Sky Blue Globe */}
    <circle cx="50" cy="50" r="44" fill="#0284C7" stroke="#38BDF8" strokeWidth="2"/>
    <circle cx="50" cy="50" r="40" fill="#0369A1"/>
    
    {/* Latitude / Longitude UN Grid */}
    <circle cx="50" cy="50" r="30" stroke="#7DD3FC" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
    <ellipse cx="50" cy="50" rx="36" ry="16" stroke="#7DD3FC" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
    <line x1="50" y1="10" x2="50" y2="90" stroke="#7DD3FC" strokeWidth="1" opacity="0.6"/>
    <line x1="10" y1="50" x2="90" y2="50" stroke="#7DD3FC" strokeWidth="1" opacity="0.6"/>
    
    {/* Female Symbol ♀ + Equal Sign Combined */}
    <circle cx="50" cy="38" r="14" stroke="#FFFFFF" strokeWidth="4.5" fill="none"/>
    <line x1="50" y1="52.5" x2="50" y2="72" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round"/>
    <line x1="40" y1="62" x2="60" y2="62" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
    <line x1="42" y1="35" x2="58" y2="35" stroke="#FACC15" strokeWidth="3" strokeLinecap="round"/>
    <line x1="42" y1="41" x2="58" y2="41" stroke="#FACC15" strokeWidth="3" strokeLinecap="round"/>
    
    {/* ONU MUJERES Pill */}
    <rect x="14" y="74" width="72" height="12" rx="6" fill="#0C4A6E"/>
    <text x="50" y="82.5" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.6">ONU MUJERES</text>
  </svg>
);

// 6. Universidad de Cartagena (UDC)
export const UnicartagenaLogo: React.FC<LogoProps> = ({ className = "w-12 h-12", size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Historic Shield */}
    <path d="M50 6L86 20V52C86 73 69.5 90 50 95C30.5 90 14 73 14 52V20L50 6Z" fill="#78350F" stroke="#F59E0B" strokeWidth="2"/>
    <path d="M50 10L82 22.5V52C82 70.5 67.5 85.5 50 90.5C32.5 85.5 18 70.5 18 52V22.5L50 10Z" fill="#451A03"/>
    
    {/* Open Book of Knowledge */}
    <path d="M28 42C36 40 44 43 50 46C56 43 64 40 72 42V66C64 64 56 67 50 70C44 67 36 64 28 66V42Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5"/>
    <line x1="50" y1="46" x2="50" y2="70" stroke="#D97706" strokeWidth="2"/>
    
    {/* Torch of Enlightenment */}
    <path d="M50 20L54 28H46L50 20Z" fill="#EF4444"/>
    <path d="M50 16C52 18 53 21 50 25C47 21 48 18 50 16Z" fill="#F59E0B"/>
    <rect x="48" y="28" width="4" height="12" fill="#D97706"/>
    
    {/* Founding Year */}
    <text x="50" y="78" textAnchor="middle" fill="#FBBF24" fontSize="6.5" fontFamily="sans-serif" fontWeight="900">DESDE 1827</text>
    <rect x="20" y="81" width="60" height="10" rx="4" fill="#9A3412"/>
    <text x="50" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="5.5" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.3">U. DE CARTAGENA</text>
  </svg>
);

// 7. Alcaldía Mayor de Cartagena de Indias
export const AlcaldiaCartagenaLogo: React.FC<LogoProps> = ({ className = "w-12 h-12", size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Oval Colonial Seal */}
    <ellipse cx="50" cy="50" rx="42" ry="46" fill="#312E81" stroke="#F59E0B" strokeWidth="2.5"/>
    <ellipse cx="50" cy="50" rx="38" ry="42" fill="#1E1B4B"/>
    
    {/* Historic Palm Tree Silhouette of Cartagena */}
    <path d="M50 62V38" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 40C42 34 32 36 28 42" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 40C58 34 68 36 72 42" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 38C44 30 36 28 30 30" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M50 38C56 30 64 28 70 30" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"/>
    
    {/* Sun / Rays behind Palm */}
    <circle cx="50" cy="30" r="7" fill="#FBBF24"/>
    
    {/* Fortress Wall Base */}
    <path d="M30 64H70V72H30V64Z" fill="#D97706"/>
    <path d="M34 64V60H40V64H46V60H52V64H58V60H64V64" stroke="#F59E0B" strokeWidth="1.5"/>
    
    {/* CARTAGENA Text Banner */}
    <rect x="14" y="74" width="72" height="12" rx="6" fill="#4338CA"/>
    <text x="50" y="82.5" textAnchor="middle" fill="#FFFFFF" fontSize="6 font-weight=900" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.5">ALCALDÍA CARTAGENA</text>
  </svg>
);

// 8. ESE Hospital Local Cartagena de Indias
export const EseHospitalLogo: React.FC<LogoProps> = ({ className = "w-12 h-12", size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Circle Container */}
    <circle cx="50" cy="50" r="44" fill="#047857" stroke="#34D399" strokeWidth="2"/>
    <circle cx="50" cy="50" r="40" fill="#064E3B"/>
    
    {/* Bright Medical Cross */}
    <rect x="42" y="22" width="16" height="56" rx="4" fill="#FFFFFF"/>
    <rect x="22" y="42" width="56" height="16" rx="4" fill="#FFFFFF"/>
    
    {/* Heartbeat EKG Pulse overlay */}
    <path d="M20 50H36L41 36L47 62L53 44L57 53L62 48H80" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* ESE Hospital Pill */}
    <rect x="16" y="74" width="68" height="12" rx="6" fill="#065F46"/>
    <text x="50" y="82.5" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.4">ESE HOSPITAL LOCAL</text>
  </svg>
);

// 9. Red Nacional de Mujeres
export const RedNacionalMujeresLogo: React.FC<LogoProps> = ({ className = "w-12 h-12", size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Circle Base */}
    <circle cx="50" cy="50" r="44" fill="#701A75" stroke="#F472B6" strokeWidth="2"/>
    <circle cx="50" cy="50" r="40" fill="#4C0519"/>
    
    {/* 4 Interconnected Sisterhood Hands / Petals */}
    <path d="M50 20C58 32 62 42 50 50C38 42 42 32 50 20Z" fill="#E12880"/>
    <path d="M80 50C68 58 58 62 50 50C58 38 68 42 80 50Z" fill="#F43F5E"/>
    <path d="M50 80C42 68 38 58 50 50C62 58 58 68 50 80Z" fill="#D946EF"/>
    <path d="M20 50C32 42 42 38 50 50C42 62 32 58 20 50Z" fill="#FB7185"/>
    
    {/* Center Core */}
    <circle cx="50" cy="50" r="9" fill="#FBBF24"/>
    <circle cx="50" cy="50" r="5" fill="#FFFFFF"/>
    
    {/* Label */}
    <rect x="14" y="74" width="72" height="12" rx="6" fill="#831843"/>
    <text x="50" y="82.5" textAnchor="middle" fill="#FFFFFF" fontSize="6 font-weight=900" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.4">RED NACIONAL MUJERES</text>
  </svg>
);

// 10. Universidad Tecnológica de Bolívar (UTB)
export const UtbLogo: React.FC<LogoProps> = ({ className = "w-12 h-12", size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Modern Tech Shield */}
    <path d="M50 6L88 24V54C88 74 69.5 91 50 96C30.5 91 12 74 12 54V24L50 6Z" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="2"/>
    <path d="M50 10L84 26.5V54C84 71.5 67.5 86.5 50 91.5C32.5 86.5 16 71.5 16 54V26.5L50 10Z" fill="#1E1B4B"/>
    
    {/* Tech Nodes & Innovation Connections */}
    <circle cx="50" cy="30" r="5" fill="#F59E0B"/>
    <circle cx="34" cy="52" r="4" fill="#3B82F6"/>
    <circle cx="66" cy="52" r="4" fill="#3B82F6"/>
    <circle cx="50" cy="68" r="4.5" fill="#10B981"/>
    
    <line x1="50" y1="30" x2="34" y2="52" stroke="#93C5FD" strokeWidth="2.5"/>
    <line x1="50" y1="30" x2="66" y2="52" stroke="#93C5FD" strokeWidth="2.5"/>
    <line x1="34" y1="52" x2="50" y2="68" stroke="#93C5FD" strokeWidth="2.5"/>
    <line x1="66" y1="52" x2="50" y2="68" stroke="#93C5FD" strokeWidth="2.5"/>
    <line x1="34" y1="52" x2="66" y2="52" stroke="#93C5FD" strokeWidth="2.5"/>

    {/* Center Core Spark */}
    <circle cx="50" cy="50" r="5" fill="#FFFFFF"/>
    
    {/* UTB Label */}
    <rect x="24" y="76" width="52" height="12" rx="6" fill="#1D4ED8"/>
    <text x="50" y="84.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="sans-serif" fontWeight="900" letterSpacing="1">UTB</text>
  </svg>
);

// Map ally IDs to their corresponding logo components
export const ALLY_LOGOS_MAP: Record<string, React.FC<LogoProps>> = {
  defensoria: DefensoriaLogo,
  'fiscalia-caivas': FiscaliaCaivasLogo,
  profamilia: ProfamiliaLogo,
  icbf: IcbfLogo,
  'onu-mujeres': OnuMujeresLogo,
  unicartagena: UnicartagenaLogo,
  'secretaria-mujer': AlcaldiaCartagenaLogo,
  'ese-hospital-local': EseHospitalLogo,
  'red-nacional-mujeres': RedNacionalMujeresLogo,
  'utb-uninunez': UtbLogo,
};

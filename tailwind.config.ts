
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// PetInsureX Brand Colors
				petinsure: {
					teal: {
						50: 'hsl(166 76% 97%)',
						100: 'hsl(167 85% 89%)',
						200: 'hsl(168 83% 78%)',
						300: 'hsl(171 77% 64%)',
						400: 'hsl(172 66% 50%)',
						500: 'hsl(173 58% 39%)',
						600: 'hsl(175 77% 26%)',
						700: 'hsl(175 84% 32%)',
						800: 'hsl(176 69% 26%)',
						900: 'hsl(176 61% 22%)'
					},
					accent: {
						pink: 'hsl(351 83% 71%)',
						orange: 'hsl(25 95% 63%)',
						yellow: 'hsl(45 93% 58%)'
					}
				}
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
				'gradient-accent': 'linear-gradient(135deg, #fb7185 0%, #fb923c 50%, #fbbf24 100%)',
				'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
			},
			backdropBlur: {
				'glass': '24px'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1rem',
				'3xl': '1.5rem'
			},
			boxShadow: {
				'glass': '0 12px 30px rgba(6, 182, 212, 0.08)',
				'glass-hover': '0 20px 40px rgba(6, 182, 212, 0.12)',
				'paw': '0 4px 20px rgba(52, 211, 153, 0.3)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'paw-bounce': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' }
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'paw-bounce': 'paw-bounce 0.6s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 3s ease-in-out infinite'
			},
			fontFamily: {
				// Pet-Friendly Font System
				'sans': ['Inter', 'system-ui', 'sans-serif'],
				'display': ['Nunito', 'system-ui', 'sans-serif'], // Warm, rounded headings
				'brand': ['Comfortaa', 'system-ui', 'sans-serif'], // Logo and special emphasis
				'body': ['Inter', 'system-ui', 'sans-serif'], // Clean body text
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }: any) {
			addUtilities({
				'.glass-card': {
					'backdrop-filter': 'blur(24px)',
					'background': 'rgba(255, 255, 255, 0.08)',
					'border': '1px solid rgba(255, 255, 255, 0.12)',
					'box-shadow': '0 12px 30px rgba(6, 182, 212, 0.08)',
					'border-radius': '1rem'
				},
				'.glass-card-hover': {
					'box-shadow': '0 20px 40px rgba(6, 182, 212, 0.12)',
					'background': 'rgba(255, 255, 255, 0.12)'
				},
				'.paw-button': {
					'min-height': '44px',
					'border-radius': '9999px',
					'background': 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
					'transition': 'all 0.2s ease-in-out'
				},
				'.paw-button:hover': {
					'transform': 'translateY(-1px)',
					'box-shadow': '0 4px 20px rgba(52, 211, 153, 0.3)'
				}
			})
		}
	],
} satisfies Config;

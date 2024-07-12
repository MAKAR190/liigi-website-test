import { Inter, Kanit, Rowdies, Montserrat } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
export const inter = Inter({ subsets: ['latin'] });
export const kanit_bold = Kanit({ subsets: ['latin'], weight: "700" });
export const kanit = Kanit({ subsets: ['latin'], weight: "500" });
export const montserrat = Montserrat({ subsets: ['latin'] });
export const montserrat_italic = Montserrat({ subsets: ['latin'], style:"italic" });
export const rowdies = Rowdies({ subsets: ['latin'], weight: "400" });

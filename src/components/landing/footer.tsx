import Link from 'next/link'
import { Clapperboard } from 'lucide-react'

const links = {
  Product: ['Features', 'Pricing', 'Templates', 'API'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Support: ['Help Center', 'Contact', 'Status', 'Community'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#0057FF] flex items-center justify-center">
                <Clapperboard className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">African Drama Studio</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              The ultimate AI-powered platform for African storytelling, drama production, and content creation.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-green-400">All systems operational</span>
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-white text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2024 African Drama Studio. All rights reserved.</p>
          <p className="text-sm">Made with ❤️ for African Creators</p>
        </div>
      </div>
    </footer>
  )
}

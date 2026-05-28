export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = ['Programs', 'About', 'Vision', 'Contact', 'Privacy Policy'];

  return (
    <footer
      className="relative bg-[#1a1a1a]"
      style={{
        borderTop: '1px solid rgba(201,168,76,0.3)',
        padding: '80px 0 40px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 - Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display font-medium text-[#faf8f3] text-xl tracking-tight">
                BICTA
              </span>
              <span className="w-px h-4 bg-[#c9a84c]" />
              <span className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#c9a84c]">
                ELITE
              </span>
            </div>
            <p className="font-body font-light text-[0.875rem] text-[#8a8680] mb-6">
              Elevating Bangladesh's Tech Ecosystem
            </p>
            <div className="flex gap-4">
              {['LinkedIn', 'X', 'Facebook', 'YouTube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-[#8a8680] hover:text-[#c9a84c] transition-colors duration-200"
                  title={social}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'LinkedIn' && (
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    )}
                    {social === 'X' && (
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    )}
                    {social === 'Facebook' && (
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    )}
                    {social === 'YouTube' && (
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Links */}
          <div>
            <div className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#c9a84c] mb-4">
              Navigation
            </div>
            <div className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="font-body font-normal text-[0.875rem] text-[#faf8f3] hover:text-[#c9a84c] transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <div className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#c9a84c] mb-4">
              Contact
            </div>
            <a
              href="mailto:info@bicta.org"
              className="block font-body font-normal text-[0.875rem] text-[#faf8f3] hover:text-[#c9a84c] transition-colors duration-200 mb-2"
            >
              info@bicta.org
            </a>
            <div className="font-body font-normal text-[0.875rem] text-[#8a8680]">
              Dhaka, Bangladesh
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(138,134,128,0.2)' }}
        >
          <div className="font-body font-normal text-[0.75rem] text-[#8a8680]">
            &copy; {currentYear} BICTA Elite. All rights reserved.
          </div>
          <div className="font-body font-normal text-[0.75rem] text-[#8a8680]">
            Crafted with precision
          </div>
        </div>
      </div>
    </footer>
  );
}

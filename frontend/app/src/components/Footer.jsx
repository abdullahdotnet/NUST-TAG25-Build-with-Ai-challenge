import { motion } from "framer-motion";
import { FiTwitter, FiGithub, FiLinkedin, FiMail, FiGlobe } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const links = [
    {
      title: "Product",
      items: [
        { name: "Features", path: "/#features" },
        { name: "Live News", path: "/about" },
        { name: "Demo", path: "/news" },
        { name: "Pricing", path: "/#pricing" },
      ],
    },
    {
      title: "Company",
      items: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Contact", path: "/contact" },
        { name: "Press", path: "/press" },
      ],
    },
    {
      title: "Resources",
      items: [
        { name: "Blog", path: "/blog" },
        { name: "Help Center", path: "/help" },
        { name: "Tutorials", path: "/tutorials" },
        { name: "API Docs", path: "/docs" },
      ],
    },
    {
      title: "Legal",
      items: [
        { name: "Privacy", path: "/privacy" },
        { name: "Terms", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
        { name: "GDPR", path: "/gdpr" },
      ],
    },
  ];

  const handleNavigation = (path) => {
    if (path.startsWith('/#')) {
      // Handle anchor links
      const section = path.split('#')[1];
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="bg-gray-900/90 backdrop-blur-md border-t border-gray-800 text-white relative z-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                <FiGlobe size={20} />
              </div>
              <span className="ml-3 text-xl font-bold">AI News Anchor</span>
            </motion.div>
            <p className="mt-4 text-gray-400">
              Revolutionizing news delivery with artificial intelligence and
              hyper-realistic digital avatars.
            </p>
            <div className="mt-6 flex space-x-6">
              {[
                { icon: <FiTwitter size={20} />, url: "https://twitter.com" },
                { icon: <FiGithub size={20} />, url: "https://github.com" },
                { icon: <FiLinkedin size={20} />, url: "https://linkedin.com" },
                { icon: <FiMail size={20} />, url: "mailto:contact@ainews.com" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {links.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.items.map((item) => (
                  <motion.li
                    key={item.name}
                    whileHover={{ x: 5 }}
                    className="text-base"
                  >
                    <motion.button
                      onClick={() => handleNavigation(item.path)}
                      className="text-gray-400 hover:text-white transition-colors text-left w-full"
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.name}
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="mt-4 text-gray-400">
              Get the latest AI news updates delivered to your inbox.
            </p>
            <div className="mt-4 flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full border border-gray-700"
              />
              <motion.button
                className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-r-md border border-blue-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} AI News Anchor. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
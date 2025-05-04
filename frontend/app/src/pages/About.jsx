import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { FiGlobe, FiUsers, FiCode, FiServer } from "react-icons/fi";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Background Video (same as Home page) */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 z-10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/assets/main.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="h-1 w-12 bg-blue-400 mr-4"></div>
                <span className="text-blue-400 uppercase tracking-wider text-sm">Our Story</span>
              </div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              >
                Revolutionizing <span className="text-blue-400">News</span> Delivery
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
              >
                We combine cutting-edge AI with journalistic integrity to deliver news faster, more accurately, and more engagingly than ever before.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/10 text-blue-400 mb-4">
                OUR MISSION
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Democratizing Information</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                We believe everyone deserves access to accurate, unbiased news in real-time, regardless of language or location.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-4 text-blue-400">The Problem</h3>
                <p className="text-gray-400 mb-4">
                  Traditional news delivery is slow, expensive, and often limited by human constraints. 
                  Time zones, language barriers, and editorial delays prevent people from getting information when they need it most.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-400 mt-1">•</div>
                    <p className="ml-2 text-gray-400">24-48 hour delays in breaking news coverage</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-400 mt-1">•</div>
                    <p className="ml-2 text-gray-400">Limited language coverage</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-400 mt-1">•</div>
                    <p className="ml-2 text-gray-400">High production costs limiting accessibility</p>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-4 text-blue-400">Our Solution</h3>
                <p className="text-gray-400 mb-4">
                  Our AI-powered platform delivers news instantly in multiple languages with hyper-realistic digital anchors, 
                  combining the speed of automation with the credibility of traditional journalism.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-400 mt-1">•</div>
                    <p className="ml-2 text-gray-400">Real-time news processing and delivery</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-400 mt-1">•</div>
                    <p className="ml-2 text-gray-400">50+ language support with native pronunciation</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-400 mt-1">•</div>
                    <p className="ml-2 text-gray-400">24/7 broadcasting with zero latency</p>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-24 bg-gradient-to-br from-gray-900 to-blue-900/20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/10 text-blue-400 mb-4">
                TECHNOLOGY
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">How We Built It</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Combining state-of-the-art AI with rigorous journalistic standards
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <FiGlobe className="w-8 h-8" />,
                  title: "Global Coverage",
                  description: "Aggregating from 5,000+ trusted sources worldwide in real-time"
                },
                {
                  icon: <FiUsers className="w-8 h-8" />,
                  title: "Digital Anchors",
                  description: "Hyper-realistic AI presenters with natural expressions and lip sync"
                },
                {
                  icon: <FiCode className="w-8 h-8" />,
                  title: "AI Processing",
                  description: "Natural language generation that maintains factual accuracy"
                },
                {
                  icon: <FiServer className="w-8 h-8" />,
                  title: "Instant Delivery",
                  description: "Edge computing for zero-latency broadcasting worldwide"
                }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400 mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/10 text-blue-400 mb-4">
                OUR TEAM
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Pioneers in AI News Avatar</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Combining years of development experience with cutting-edge AI research
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  name: "Abdullah Ghazi",
                  role: "Data Engineer",
                  bio: "Managed AI solution",
                  avatar: "👨"
                },
                {
                  name: "Hamza Faiz",
                  role: "Data Engineer",
                  bio: "Managed AI solution",
                  avatar: "👨"
                },
                {
                  name: "Syed Muhammad Raza Ali",
                  role: "Web Developer",
                  bio: "Built real-time web app for AI News",
                  avatar: "👨"
                }
              ].map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-8 text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl mx-auto mb-6">
                    {member.avatar}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-blue-400 mb-4">{member.role}</p>
                  <p className="text-gray-400">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30"></div>
          </div>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Experience the Future of News?</h2>
              <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
                Join thousands of viewers who get their news from our AI-powered broadcast system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center"
                  onClick={() => navigate('/news')}
               >
                  
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-blue-400 hover:bg-blue-400/10 rounded-lg font-medium flex items-center justify-center"
                  onClick={() => navigate('/contact')}                
                >
                  Contact Sales
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
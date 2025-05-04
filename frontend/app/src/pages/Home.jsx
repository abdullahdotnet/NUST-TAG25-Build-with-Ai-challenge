import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import { FiPlay, FiArrowRight, FiClock, FiGlobe, FiUser, FiVolume2, FiShare2 } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const backgroundVideoRef = useRef(null);
  const tickerVideoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const newsItems = useMemo(() => [
    {
      id: 1,
      title: "Nust TAG25 Competition",
      category: "Technology",
      duration: "0:11",
      views: "1.2M",
      excerpt: "Build with AI...",
      avatar: "female",
      videoDuration: 15000 
    },
    {
      id: 2,
      title: "Nust TAG25 Competition",
      category: "Technology",
      duration: "0:11",
      views: "1.2M",
      excerpt: "Build with AI...",
      avatar: "female",
      videoDuration: 15000 
    },
    {
      id: 3,
      title: "Nust TAG25 Competition",
      category: "Technology",
      duration: "0:11",
      views: "1.2M",
      excerpt: "Build with AI...",
      avatar: "female",
      videoDuration: 15000 
    },

  ], []);

  
  useEffect(() => {
    const initVideos = async () => {
      try {
        if (backgroundVideoRef.current && tickerVideoRef.current) {
          await Promise.all([
            backgroundVideoRef.current.play(),
            tickerVideoRef.current.play()
          ]);
          setIsVideoReady(true);
        }
      } catch (err) {
        console.log("Autoplay prevented:", err);
      }
    };

    initVideos();


    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, newsItems[currentNewsIndex].videoDuration);

    const handleVideoEnd = (e) => {
      e.target.currentTime = 0;
      e.target.play().catch(e => console.log("Playback error:", e));
    };

    const videos = [backgroundVideoRef.current, tickerVideoRef.current];
    videos.forEach(video => {
      if (video) {
        video.addEventListener('ended', handleVideoEnd);
      }
    });

    return () => {
      clearInterval(interval);
      videos.forEach(video => {
        if (video) {
          video.removeEventListener('ended', handleVideoEnd);
        }
      });
    };
  }, [currentNewsIndex, newsItems]);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
    
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 z-10"></div>
        <video
          ref={backgroundVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/assets/main.mp4" type="video/mp4" />
        </video>
      </div>

    
      <div className="relative z-10">
    
        <section className="relative h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="flex items-center mb-6">
                    <div className="h-1 w-12 bg-blue-400 mr-4"></div>
                    <span className="text-blue-400 uppercase tracking-wider text-sm">Live Broadcast</span>
                  </div>
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
                  >
                    The Future of <span className="text-blue-400">News</span> is Here
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-xl text-gray-300 mb-10 max-w-2xl"
                  >
                    Experience 24/7 AI-powered news broadcasting with hyper-realistic digital anchors delivering real-time updates.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center"
                      onClick={() => navigate('/news')}                      
                    >
                      <FiPlay className="mr-2" /> Watch Live Broadcast
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-transparent border-2 border-blue-400 hover:bg-blue-400/10 rounded-lg font-medium flex items-center justify-center"
                      onClick={() => navigate('/news')}  
                    >
                      How It Works <FiArrowRight className="ml-2" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>

            
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl blur-lg"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-md rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                  <div className="p-1 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="flex items-center px-4 py-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs font-medium">LIVE NOW</span>
                      <div className="ml-auto flex items-center">
                        <span className="text-xs mr-2">EN</span>
                        <FiVolume2 className="text-sm" />
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentNewsIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="p-6"
                    >
                      <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4 relative">
                        {!isVideoReady && (
                          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                            <div className="animate-pulse">Loading broadcast...</div>
                          </div>
                        )}
                        <video
                          ref={tickerVideoRef}
                          autoPlay
                          loop
                       
                          playsInline
                          preload="auto"
                          className={`w-full h-full object-cover ${isVideoReady ? 'block' : 'hidden'}`}
                        >
                          <source src="/assets/hero.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                              {newsItems[currentNewsIndex].avatar === "female" ? "👩" : "👨"}
                            </div>
                            <div>
                              <h4 className="font-medium">AI News Anchor</h4>
                              <p className="text-xs text-gray-400">{newsItems[currentNewsIndex].duration}</p>
                            </div>
                            <button className="ml-auto bg-blue-600 hover:bg-blue-700 rounded-full p-2">
                              <FiShare2 className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="inline-block px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded mb-2">
                          {newsItems[currentNewsIndex].category}
                        </span>
                        <h3 className="text-xl font-semibold mb-2">{newsItems[currentNewsIndex].title}</h3>
                        <p className="text-gray-400 mb-3">{newsItems[currentNewsIndex].excerpt}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{newsItems[currentNewsIndex].views} views</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>

        
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-gray-900/80 border-t border-gray-800 py-3 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="flex whitespace-nowrap"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center mx-8">
                  <span className="text-blue-400 font-medium mr-4">• BREAKING •</span>
                  <span className="mr-8">Global markets react to new economic policy</span>
                  <span className="text-blue-400 font-medium mr-4">• BREAKING •</span>
                  <span className="mr-8">Tech giant unveils revolutionary AI assistant</span>
                  <span className="text-blue-400 font-medium mr-4">• BREAKING •</span>
                  <span className="mr-8">Scientists discover potential cancer breakthrough</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

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
                TECHNOLOGY
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Next Generation News Delivery</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Our AI-powered system revolutionizes how news is gathered, processed, and delivered.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FiClock className="w-6 h-6" />,
                  title: "Real-time Processing",
                  description: "News is scraped, analyzed, and broadcast within minutes of publication"
                },
                {
                  icon: <FiGlobe className="w-6 h-6" />,
                  title: "Multilingual Support",
                  description: "Seamless switching between English and Urdu with native pronunciation"
                },
                {
                  icon: <FiUser className="w-6 h-6" />,
                  title: "Hyper-realistic Avatars",
                  description: "Digital anchors with perfect lip sync and natural expressions"
                }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-8 hover:border-blue-500/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400 mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        <section className="py-24 bg-gradient-to-br from-gray-900 to-blue-900/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
          
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/10 text-blue-400 mb-4">
                HOW IT WORKS
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">From Source to Screen</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Our automated pipeline transforms raw news into professional broadcasts
              </p>
            </motion.div>

            <div className="relative">
              <div className="hidden lg:block absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-blue-500/30 to-transparent"></div>
              
              {[
                {
                  step: "01",
                  title: "Web Scraping",
                  description: "Our system automatically collects news from trusted sources every hour",
                  direction: "left"
                },
                {
                  step: "02",
                  title: "Content Analysis",
                  description: "AI processes articles into natural-sounding broadcast scripts",
                  direction: "right"
                },
                {
                  step: "03",
                  title: "Avatar Rendering",
                  description: "Digital anchor delivers the news with perfect lip synchronization",
                  direction: "left"
                },
                {
                  step: "04",
                  title: "Quality Assurance",
                  description: "Automated checks ensure broadcast-ready quality",
                  direction: "right"
                }
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative mb-16 lg:mb-24 lg:w-1/2 ${item.direction === "left" ? "lg:pr-16" : "lg:pl-16 lg:ml-auto"}`}
                >
                  <div className={`absolute top-0 hidden lg:block ${item.direction === "left" ? "-right-2" : "-left-2"}`}>
                    <div className="h-5 w-5 rounded-full bg-blue-500 border-4 border-gray-900"></div>
                  </div>
                  <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-8 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 h-40 w-40 bg-blue-500/10 rounded-full blur-xl"></div>
                    <span className="text-6xl font-bold text-blue-500/10 absolute -right-4 -top-4">{item.step}</span>
                    <div className="relative">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/10 text-blue-400 mb-4">
                        STEP {item.step}
                      </span>
                      <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                  <FiPlay className="mr-2" /> Start Watching Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-blue-400 hover:bg-blue-400/10 rounded-lg font-medium flex items-center justify-center"
                  onClick={() => navigate('/about')}  
                >
                 About US
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
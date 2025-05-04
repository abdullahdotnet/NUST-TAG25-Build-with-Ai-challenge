import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { FiPlay, FiPause, FiVolume2, FiShare2, FiGlobe, FiClock, FiEye } from "react-icons/fi";

const News = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const videoRef = useRef(null);
  const [currentNews, setCurrentNews] = useState(0);

  const categories = [
    { id: "all", name: "All News" },
    { id: "politics", name: "Politics" },
    { id: "technology", name: "Technology" },
    { id: "sports", name: "Sports" },
    { id: "business", name: "Business" },
  ];

  const newsItems = [
    {
      id: 1,
      title: "Global Summit Addresses Climate Change Crisis",
      category: "politics",
      duration: "2:45",
      views: "1.2M",
      timestamp: "10 min ago",
      avatar: "female",
      excerpt: "World leaders commit to unprecedented emissions reductions at emergency summit",
      videoUrl: "/news-climate.mp4",
      transcript: [
        "AI Anchor: Breaking news from the Global Climate Summit...",
        "The historic agreement includes binding targets for all major economies...",
        "Scientists warn this may be our last chance to avoid catastrophic warming..."
      ]
    },
    {
      id: 2,
      title: "Quantum Computing Breakthrough Announced",
      category: "technology",
      duration: "3:12",
      views: "2.4M",
      timestamp: "25 min ago",
      avatar: "male",
      excerpt: "Researchers achieve quantum supremacy with new 128-qubit processor design",
      videoUrl: "/news-quantum.mp4",
      transcript: [
        "AI Anchor: A major milestone in computing technology...",
        "The new processor solved in minutes what would take traditional supercomputers years...",
        "Potential applications include medicine, cryptography, and AI development..."
      ]
    },
    {
      id: 3,
      title: "National Team Wins World Championship",
      category: "sports",
      duration: "1:58",
      views: "3.1M",
      timestamp: "1 hour ago",
      avatar: "female",
      excerpt: "Underdog victory shocks sports world with last-minute goal",
      videoUrl: "/news-sports.mp4",
      transcript: [
        "AI Anchor: An incredible moment in sports history...",
        "The underdog team overcame 3-1 deficit in final minutes...",
        "Captain dedicated the win to their late coach..."
      ]
    }
  ];

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const selectNewsItem = (index) => {
    setCurrentNews(index);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 z-10"></div>
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
          <source src="/assets/main.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex overflow-x-auto py-4 space-x-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700">
                  <h2 className="text-xl font-bold">Latest Broadcasts</h2>
                </div>
                <div className="divide-y divide-gray-800">
                  {newsItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ backgroundColor: "rgba(37, 99, 235, 0.1)" }}
                      className={`p-4 cursor-pointer ${currentNews === index ? "bg-blue-900/20" : ""}`}
                      onClick={() => selectNewsItem(index)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-16 w-16 rounded-md bg-blue-900/30 overflow-hidden flex items-center justify-center">
                          <span className="text-2xl">
                            {item.avatar === "female" ? "👩" : "👨"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <span className="text-xs font-medium text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
                            {item.category}
                          </span>
                          <h3 className="text-sm font-medium text-white mt-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">{item.excerpt}</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <FiClock className="mr-1" size={12} />
                            <span className="mr-3">{item.duration}</span>
                            <FiEye className="mr-1" size={12} />
                            <span>{item.views}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:w-2/3">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="relative pt-[56.25%] bg-black">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={newsItems[currentNews].videoUrl}
                  />
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-blue-600/80 hover:bg-blue-700/80 rounded-full p-4"
                        onClick={togglePlayback}
                      >
                        <FiPlay size={32} />
                      </motion.button>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 border-t border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-white"
                        onClick={togglePlayback}
                      >
                        {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-white">
                        <FiVolume2 size={20} />
                      </motion.button>
                      <div className="text-white text-sm">1:24 / {newsItems[currentNews].duration}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-white flex items-center text-sm">
                        <FiGlobe className="mr-2" /> EN
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-white flex items-center text-sm">
                        <FiShare2 className="mr-2" /> Share
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                        {newsItems[currentNews].category}
                      </span>
                      <h2 className="mt-2 text-xl font-bold text-white">{newsItems[currentNews].title}</h2>
                    </div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <FiClock className="mr-1" size={14} />
                      <span className="mr-3">{newsItems[currentNews].timestamp}</span>
                      <FiEye className="mr-1" size={14} />
                      <span>{newsItems[currentNews].views}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-white mb-3">Transcript</h3>
                    <div className="space-y-3">
                      {newsItems[currentNews].transcript.map((line, i) => (
                        <motion.div key={i} whileHover={{ backgroundColor: "rgba(37, 99, 235, 0.2)" }} className="p-3 rounded-lg border border-gray-800">
                          <p className="text-gray-300">{line}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;

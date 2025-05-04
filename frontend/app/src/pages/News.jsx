import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { FiVolume2, FiClock, FiEye } from "react-icons/fi";

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentNews, setCurrentNews] = useState(0);
  const videoRef = useRef(null);

  const categories = [
    { id: "English", name: "English" },
    { id: "Urdu", name: "Urdu" },
  
  ];

  useEffect(() => {
    const fetchNewsVideos = async () => {
      try {
        console.log('Attempting to fetch from:', 'http://127.0.0.1:8000/news/videos?limit=10');
        const response = await fetch('http://localhost:8000/news/videos?limit=10');
        if (!response.ok) {
          throw new Error('Failed to fetch news videos');
        }
        const data = await response.json();
         
        const transformedData = data.videos.map((video, index) => ({
          id: video.video_id,
          title: video.title,
          category: video.source.toLowerCase(),
          duration: "2:45", 
          views: `${Math.floor(Math.random() * 5) + 1}M`, 
          avatar: index % 2 === 0 ? "female" : "male",
          excerpt: video.script.split('\n')[0] || "No excerpt available",
          videoUrl: video.video_url,
          transcript: video.script.split('\n').filter(line => line.trim() !== '')
        }));

        setNewsItems(transformedData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchNewsVideos();
  }, []);

  // Handle video ended event
  const handleVideoEnd = () => {
    const nextIndex = (currentNews + 1) % newsItems.length;
    setCurrentNews(nextIndex);
  };

  // Set up and clean up event listener
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnd);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [currentNews, newsItems.length]); // Dependencies ensure proper cleanup and setup

  const selectNewsItem = (index) => {
    setCurrentNews(index);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (newsItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">No news videos available</div>
      </div>
    );
  }

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
                <div className="relative w-full aspect-video bg-black">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-contain"
                    src={newsItems[currentNews]?.videoUrl}
                    autoPlay
                    controls
                    playsInline
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                        {newsItems[currentNews]?.category}
                      </span>
                      <h2 className="mt-2 text-xl font-bold text-white">{newsItems[currentNews]?.title}</h2>
                    </div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <FiEye className="mr-1" size={14} />
                      <span>{newsItems[currentNews]?.views}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-white mb-3">Transcript</h3>
                    <div className="space-y-3">
                      {newsItems[currentNews]?.transcript.map((line, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ backgroundColor: "rgba(37, 99, 235, 0.2)" }} 
                          className="p-3 rounded-lg border border-gray-800"
                        >
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

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiMail, FiMapPin, FiPhone, FiSend, FiCheck, FiAlertCircle, FiClock } from "react-icons/fi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("idle"); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    
    try {
     
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="bg-gray-900 text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 z-10"></div>
        <div className="absolute inset-0 bg-gray-900 opacity-90"></div>
      </div>

      
      <div className="relative z-10">
      
        <section className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="h-1 w-12 bg-blue-400 mr-4"></div>
                <span className="text-blue-400 uppercase tracking-wider text-sm">Connect With Us</span>
              </div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              >
                Contact <span className="text-blue-400">Our Team</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto"
              >
                Have questions about our AI broadcasting technology? Reach out and we'll respond within 24 hours.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl"
              >
                <h2 className="text-2xl font-bold mb-8 flex items-center">
                  <FiMail className="mr-3 text-blue-400" />
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about your inquiry..."
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={status === "submitting"}
                    whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
                    whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
                    className={`w-full py-4 rounded-lg font-medium flex items-center justify-center transition-all ${
                      status === "submitting" 
                        ? "bg-blue-700 cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {status === "submitting" ? (
                      "Sending..."
                    ) : status === "success" ? (
                      <>
                        <FiCheck className="mr-2" /> Message Sent
                      </>
                    ) : status === "error" ? (
                      <>
                        <FiAlertCircle className="mr-2" /> Error Sending
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-2" /> Send Message
                      </>
                    )}
                  </motion.button>
                  
                  <AnimatePresence>
                    {(status === "success" || status === "error") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mt-4 p-4 rounded-lg ${
                          status === "success" 
                            ? "bg-green-900/30 text-green-400 border border-green-800" 
                            : "bg-red-900/30 text-red-400 border border-red-800"
                        }`}
                      >
                        {status === "success" 
                          ? "Thank you! Your message has been sent." 
                          : "Error sending message. Please try again."}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>

             
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl hover:border-blue-500/30 transition-all">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <FiMapPin className="mr-3 text-blue-400" />
                    Our Headquarters
                  </h3>
                  <p className="text-gray-300 mb-2">PUCIT AI News Broadcasting Center</p>
                  <p className="text-gray-400">PUCIT</p>
                  <p className="text-gray-400">Lahore, Canal Road 54000</p>
                  <p className="text-gray-400">Punjab,Pakistan</p>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl hover:border-blue-500/30 transition-all">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <FiPhone className="mr-3 text-blue-400" />
                    Contact Channels
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 mb-1">General Inquiries</p>
                      <p className="text-gray-300 hover:text-blue-400 transition-colors">
                        <a href="mailto:info@ainews.tv">info@ainews.tv</a>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Technical Support</p>
                      <p className="text-gray-300 hover:text-blue-400 transition-colors">
                        <a href="mailto:support@ainews.tv">support@ainews.tv</a>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Phone</p>
                      <p className="text-gray-300">+92 (328) 4003-835</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl hover:border-blue-500/30 transition-all">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <FiClock className="mr-3 text-blue-400" />
                    Broadcast Hours
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">Monday - Friday</span>
                      <span className="text-gray-300">24/7</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Weekends</span>
                      <span className="text-gray-300">24/7</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        
        <section className="py-20 pb-32 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-y border-gray-800">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-4">Stay Updated with AI News</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest in AI-powered news broadcasting technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
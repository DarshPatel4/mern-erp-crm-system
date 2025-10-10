import { useState } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp, FaQuestionCircle, FaUser, FaCog, FaUsers, FaChartBar, FaExclamationTriangle, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Sidebar from '../admin/components/Sidebar';
import Header from '../admin/components/Header';

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      id: 1,
      question: "How can I reset my password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your email address and follow the instructions sent to your email. If you don't receive the email, check your spam folder or contact your system administrator.",
      icon: <FaUser className="text-blue-500" />
    },
    {
      id: 2,
      question: "How do I update my profile information?",
      answer: "Navigate to your profile settings by clicking on your avatar in the top-right corner, then select 'Profile Settings'. You can update your personal information, contact details, and preferences from there.",
      icon: <FaCog className="text-green-500" />
    },
    {
      id: 3,
      question: "How to add a new customer or lead?",
      answer: "Go to the Leads section from the main navigation. Click the 'Add New Lead' button and fill in the required information including contact details, company information, and lead source. Save the lead to add it to your pipeline.",
      icon: <FaUsers className="text-purple-500" />
    },
    {
      id: 4,
      question: "How can I view my sales reports?",
      answer: "Access sales reports by navigating to the Analytics section. You can view various reports including sales performance, lead conversion rates, and revenue analytics. Use the date filters to customize your report period.",
      icon: <FaChartBar className="text-orange-500" />
    },
    {
      id: 5,
      question: "What should I do if a page doesn't load properly?",
      answer: "If a page doesn't load properly, try refreshing the browser (Ctrl+F5 or Cmd+Shift+R). Clear your browser cache and cookies. If the issue persists, check your internet connection or contact technical support.",
      icon: <FaExclamationTriangle className="text-red-500" />
    },
    {
      id: 6,
      question: "How do I manage user roles and permissions?",
      answer: "Administrators can manage user roles by going to Settings > Roles & Permissions. From there, you can create new roles, modify existing permissions, and assign roles to users. Each role can have different access levels to various system features.",
      icon: <FaCog className="text-indigo-500" />
    },
    {
      id: 7,
      question: "How can I export data from the system?",
      answer: "Most sections in the system have export functionality. Look for the 'Export' button or 'Download' option in the respective sections. You can export data in various formats including CSV, Excel, and PDF depending on the module.",
      icon: <FaChartBar className="text-teal-500" />
    },
    {
      id: 8,
      question: "How do I set up email notifications?",
      answer: "Go to Settings > Notification Preferences to configure your email notifications. You can choose which types of notifications you want to receive, set quiet hours, and customize notification frequency for different events.",
      icon: <FaEnvelope className="text-pink-500" />
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send the form data to the backend
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Help & Support" />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
              <p className="text-gray-600">Find answers to common questions and get in touch with our support team</p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Help Topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* FAQs Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaQuestionCircle className="text-violet-600 text-2xl" />
                  <h2 className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</h2>
                </div>
                
                <div className="space-y-4">
                  {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq) => (
                      <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {faq.icon}
                            <span className="font-medium text-gray-900">{faq.question}</span>
                          </div>
                          {expandedFAQ === faq.id ? (
                            <FaChevronUp className="text-gray-400" />
                          ) : (
                            <FaChevronDown className="text-gray-400" />
                          )}
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className="px-4 pb-4 border-t border-gray-100">
                            <p className="text-gray-600 mt-3 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaSearch className="mx-auto text-4xl mb-4 text-gray-300" />
                      <p>No FAQs found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Us Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaEnvelope className="text-violet-600 text-2xl" />
                  <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                      placeholder="Please provide detailed information about your question or issue..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-violet-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-violet-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                  >
                    Submit Message
                  </button>
                </form>

                {/* Contact Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Other Ways to Reach Us</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaEnvelope className="text-violet-500" />
                      <span>support@nexuserp.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaPhone className="text-violet-500" />
                      <span>+91 9979099218</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaMapMarkerAlt className="text-violet-500" />
                      <span>Bhuravav, Godhra</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Help Resources */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <FaQuestionCircle className="mx-auto text-3xl text-violet-500 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">User Guide</h4>
                  <p className="text-sm text-gray-600">Comprehensive guide covering all system features and functionality.</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <FaChartBar className="mx-auto text-3xl text-violet-500 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Video Tutorials</h4>
                  <p className="text-sm text-gray-600">Step-by-step video tutorials for common tasks and workflows.</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <FaUsers className="mx-auto text-3xl text-violet-500 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Community Forum</h4>
                  <p className="text-sm text-gray-600">Connect with other users and share tips and best practices.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

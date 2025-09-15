function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">LMS LEARN</h3>
            <p className="text-gray-300">
              Empowering learners worldwide with quality education and live sessions.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Courses</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">All Courses</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Live Sessions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Categories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 LMS LEARN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

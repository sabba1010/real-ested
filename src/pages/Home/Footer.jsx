import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-bold text-green-600">
              RealEstate
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Your trusted partner for finding dream properties.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-xl text-gray-500 hover:text-green-600">
                <FaFacebook />
              </a>
              <a href="#" className="text-xl text-gray-500 hover:text-green-600">
                <FaTwitter />
              </a>
              <a href="#" className="text-xl text-gray-500 hover:text-green-600">
                <FaInstagram />
              </a>
              <a href="#" className="text-xl text-gray-500 hover:text-green-600">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/properties" className="hover:underline">Properties</Link></li>
              <li><Link to="/wishlist" className="hover:underline">Wishlist</Link></li>
              <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-2">Newsletter</h3>
            <p className="text-sm text-gray-500 mb-2">Subscribe to get the latest updates.</p>
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full max-w-xs mb-2"
            />
            <button className="btn btn-success btn-sm w-full">Subscribe</button>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t mt-10 pt-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} RealEstate. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

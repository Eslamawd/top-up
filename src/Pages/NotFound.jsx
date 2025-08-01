import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "../components/ui/button";

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex flex-col items-center justify-center text-center mt-16 py-12 md:py-20"
    >
      <h1 className="text-9xl font-bold text-black dark:text-red-700">404</h1>
      <h2 className="text-3xl font-bold text-red-900 dark:text-white mt-6">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link to="/">
          <Button size="lg">
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Button>
        </Link>
        <Link to="/services">
          <Button variant="outline" size="lg">
            <Search className="mr-2 h-5 w-5" />
            Browse Services
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;

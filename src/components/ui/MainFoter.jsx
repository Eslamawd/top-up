import React from 'react';
import { ShoppingCart, Search, Clock, CreditCard, Shield, DollarSign, Percent, Headset } from 'lucide-react';
import { motion } from 'framer-motion';

// Data for the top feature section of the footer
const footerFeatures = [
  {
    icon: <ShoppingCart size={24} className="text-blue-50" />,
    title: "Widest range of products",
    description: "The store offers the widest range of products.",
  },
  {
    icon: <Search size={24} className="text-blue-50" />,
    title: "Easy to find a key",
    description: "You spend a minimum of time and effort on finding a key",
  },
  {
    icon: <Clock size={24} className="text-blue-50" />,
    title: "Instant key delivery",
    description: "You receive the purchased key instantly, without any waiting.",
  },
  {
    icon: <CreditCard size={24} className="text-blue-50" />,
    title: "Multiple payment methods",
    description: "Multiple payment methods. Now even more accessible",
  },
  {
    icon: <Shield size={24} className="text-blue-50" />,
    title: "Guaranteed products",
    description: "Absolutely all products are guaranteed.",
  },
  {
    icon: <DollarSign size={24} className="text-blue-50" />,
    title: "Save significant funds",
    description: "Our prices allow you to save a significant part of your funds.",
  },
  {
    icon: <Percent size={24} className="text-blue-50" />,
    title: "Automatic discounts",
    description: "Automatic discounts for regular customers",
  },
  {
    icon: <Headset size={24} className="text-blue-50" />,
    title: "Competent technical support",
    description: "We have fast, polite and competent technical support",
  },
];

function FooterTopFeatures() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow-sm mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {footerFeatures.map((feature, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="flex-shrink-0 p-2 bg-blue-950 text-gray-100 rounded-xl">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-base mb-1">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default  FooterTopFeatures;
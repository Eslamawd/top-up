
import { motion } from "framer-motion";
import MainLayout from "../components/MainLayout";
import { Briefcase, Users, Globe, Shield, Zap, Award } from "lucide-react";

const About = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="container mx-auto px-4 py-12"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About ServexLB</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to make digital services accessible, affordable, and reliable for everyone.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Founded in 2020, ServexLB began with a simple idea: to create a one-stop platform where users could access premium digital services at affordable prices.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              What started as a small operation has grown into a trusted platform serving thousands of customers worldwide. Our commitment to quality, reliability, and customer satisfaction remains at the core of everything we do.
            </p>
            <p className="text-lg text-muted-foreground">
              Today, we offer a wide range of digital services including streaming subscriptions, gaming accounts, software licenses, and more – all with instant delivery and dedicated support.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-full max-w-md h-80 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-bold text-primary/40">ServexLB</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card p-8 rounded-xl shadow-sm"
            >
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trust & Reliability</h3>
              <p className="text-muted-foreground">
                We prioritize building trust through consistent, reliable service and transparent practices.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card p-8 rounded-xl shadow-sm"
            >
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer-First</h3>
              <p className="text-muted-foreground">
                Every decision we make puts our customers' needs and satisfaction at the forefront.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card p-8 rounded-xl shadow-sm"
            >
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously improve our platform and services to stay ahead of industry trends.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <div className="w-32 h-32 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-primary/60" />
              </div>
              <h3 className="text-xl font-semibold">Salim Hage</h3>
              <p className="text-muted-foreground">Founder & CEO</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <div className="w-32 h-32 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-primary/60" />
              </div>
              <h3 className="text-xl font-semibold">Michael Chen</h3>
              <p className="text-muted-foreground">CTO</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center"
            >
              <div className="w-32 h-32 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-primary/60" />
              </div>
              <h3 className="text-xl font-semibold">David Rodriguez</h3>
              <p className="text-muted-foreground">Head of Operations</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
              className="text-center"
            >
              <div className="w-32 h-32 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-primary/60" />
              </div>
              <h3 className="text-xl font-semibold">Sarah Johnson</h3>
              <p className="text-muted-foreground">Chief Marketing Officer</p>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-12 rounded-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover why thousands of customers trust ServexLB for their digital service needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/services" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Browse Services
            </a>
            <a href="/contact" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-lg font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
              Contact Us
            </a>
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default About;

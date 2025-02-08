import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Code,
  BrainCircuit,
  Rocket,
  Lightbulb,
  CheckCircle,
  Users,
  Trophy,
  Terminal,
  MessageCircle,
} from "lucide-react";

export default function LeetcodeLanding() {
  const [activeTab, setActiveTab] = useState("algorithms");

  return (
    <div className="bg-zinc-900 text-white">
      {/* Navbar */}
      <div className="fixed w-full h-16 bg-zinc-900 border-b border-zinc-700 flex justify-between items-center px-6 z-50">
        <Link
          to="/"
          className="text-2xl font-bold text-orange-500 flex items-center gap-2"
        >
          <BrainCircuit className="w-6 h-6" /> FireCode
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-zinc-300 hover:text-orange-500 transition"
          >
            Sign In
          </Link>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white transition-transform transform hover:scale-105">
            Get Started
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center bg-[url('/coding-bg.jpg')] bg-cover bg-fixed px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-orange-500 drop-shadow-lg">
          The New Way to Learn Coding
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-3xl">
          Solve real-world coding problems, master algorithms, and prepare for
          technical interviews with interactive challenges.
        </p>
        <Button className="mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-3 text-lg font-semibold transition-transform transform hover:scale-105">
          Start Coding Now
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-800">
        <h2 className="text-center text-4xl font-bold text-orange-500">
          Why Choose FireCode?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-6 md:px-12">
          {[
            {
              icon: <Code className="w-10 h-10 text-orange-500" />,
              title: "Real Coding Challenges",
              desc: "Solve problems across multiple domains with interactive coding challenges.",
            },
            {
              icon: <Lightbulb className="w-10 h-10 text-orange-500" />,
              title: "AI-Powered Hints",
              desc: "Get instant AI-driven hints when you're stuck on a problem.",
            },
            {
              icon: <Rocket className="w-10 h-10 text-orange-500" />,
              title: "Interview Ready",
              desc: "Prepare for FAANG and top tech companies with curated question sets.",
            },
          ].map((feature, index) => (
            <Card key={index} className="bg-zinc-900 p-6 text-center shadow-lg">
              <CardContent>
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                <p className="text-gray-300 mt-2">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Problem Categories (Tabs) */}
      <section className="py-20 bg-[url('/dark-pattern.jpg')] bg-cover bg-fixed text-center">
        <h2 className="text-4xl font-bold text-orange-500">Explore Problems</h2>
        <div className="flex justify-center mt-6 gap-4">
          {["algorithms", "data structures", "system design"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-lg font-semibold ${
                activeTab === tab
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-700 hover:bg-zinc-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-gray-300 mt-4">
          {activeTab === "algorithms"
            ? "Master sorting, searching, dynamic programming, and more."
            : activeTab === "data structures"
            ? "Learn about trees, graphs, heaps, and advanced structures."
            : "Build scalable systems with design questions and case studies."}
        </p>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-zinc-800">
        <h2 className="text-4xl text-center font-bold text-orange-500">
          What Our Users Say
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 mt-12 px-6">
          {[
            {
              name: "Sarah M.",
              feedback:
                "FireCode helped me land my dream job at Google! The problems and mock interviews were amazing.",
            },
            {
              name: "Jake P.",
              feedback:
                "The AI hints and structured roadmap were game-changers in my coding journey!",
            },
          ].map((testimonial, index) => (
            <Card
              key={index}
              className="bg-zinc-900 p-6 shadow-lg w-full md:w-1/2"
            >
              <CardContent>
                <MessageCircle className="w-8 h-8 text-orange-500" />
                <p className="mt-4 text-gray-300">{testimonial.feedback}</p>
                <h4 className="mt-2 text-lg font-semibold text-orange-500">
                  - {testimonial.name}
                </h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="h-64 flex flex-col justify-center items-center bg-[url('/code-bg.jpg')] bg-cover bg-fixed text-center">
        <h2 className="text-4xl font-bold text-orange-500">
          Ready to Level Up?
        </h2>
        <Button className="mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-3 text-lg font-semibold transition-transform transform hover:scale-105">
          Join Now
        </Button>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-900 text-center border-t border-zinc-700">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12">
          <Link
            to="/"
            className="text-2xl font-bold text-orange-500 flex items-center gap-2"
          >
            <BrainCircuit className="w-6 h-6" /> FireCode
          </Link>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/about" className="text-gray-300 hover:text-orange-500">
              About
            </Link>
            <Link to="/faq" className="text-gray-300 hover:text-orange-500">
              FAQ
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-orange-500">
              Contact
            </Link>
          </div>
        </div>
        <p className="mt-6 text-gray-500">© 2025 FireCode. All rights reserved.</p>
      </footer>
    </div>
  );
}
